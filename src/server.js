const http = require("http");
const fs = require("fs");
const path = require("path");
const { createTask, updateTask, validateTaskInput } = require("./taskLogic");

const TASKS_PATH = "/tasks";
const TASKS_PAGE_PATH = path.join(__dirname, "..", "public", "index.html");
const TASK_PATH_PATTERN = /^\/tasks\/(\d+)$/;

function hasOwnField(object, field) {
  return Object.prototype.hasOwnProperty.call(object ?? {}, field);
}

function wantsHtml(request) {
  return request.headers.accept?.includes("text/html");
}

function sendJson(response, statusCode, body) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(body));
}

function sendNoContent(response) {
  response.statusCode = 204;
  response.end();
}

function sendError(response, statusCode, errors) {
  sendJson(response, statusCode, { errors });
}

function sendTasksPage(response) {
  response.statusCode = 200;
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.end(fs.readFileSync(TASKS_PAGE_PATH, "utf8"));
}

function readJsonBody(request, onSuccess, onError) {
  let rawBody = "";

  request.on("data", (chunk) => {
    rawBody += chunk;
  });

  request.on("end", () => {
    if (!rawBody) {
      onSuccess({});
      return;
    }

    try {
      onSuccess(JSON.parse(rawBody));
    } catch {
      onError(["Invalid JSON"]);
    }
  });

  request.on("error", () => {
    onError(["Could not read request body"]);
  });
}

function getPathname(request) {
  return new URL(request.url, "http://localhost").pathname;
}

function getTaskId(pathname) {
  const match = pathname.match(TASK_PATH_PATTERN);

  return match ? Number(match[1]) : null;
}

function findTaskIndex(tasks, id) {
  return tasks.findIndex((task) => task.id === id);
}

function validateTaskUpdateInput(input) {
  if (hasOwnField(input, "title")) {
    return validateTaskInput({
      title: input.title,
      description: input.description ?? ""
    });
  }

  return {
    valid: true,
    errors: []
  };
}

function createTaskServer() {
  const tasks = [];
  let nextId = 1;

  return http.createServer((request, response) => {
    const pathname = getPathname(request);
    const taskId = getTaskId(pathname);

    if (request.method === "GET" && pathname === "/") {
      response.statusCode = 302;
      response.setHeader("Location", TASKS_PATH);
      response.end();
      return;
    }

    if (request.method === "GET" && pathname === TASKS_PATH) {
      if (wantsHtml(request)) {
        sendTasksPage(response);
        return;
      }

      sendJson(response, 200, tasks);
      return;
    }

    if (request.method === "GET" && taskId !== null) {
      const task = tasks.find((currentTask) => currentTask.id === taskId);

      if (!task) {
        sendError(response, 404, ["Task not found"]);
        return;
      }

      sendJson(response, 200, task);
      return;
    }

    if (request.method === "POST" && pathname === TASKS_PATH) {
      readJsonBody(request, (body) => {
        const validation = validateTaskInput(body);

        if (!validation.valid) {
          sendError(response, 400, validation.errors);
          return;
        }

        const task = createTask(body, nextId);
        nextId += 1;
        tasks.push(task);

        sendJson(response, 201, task);
      }, (errors) => sendError(response, 400, errors));

      return;
    }

    if ((request.method === "PUT" || request.method === "PATCH") && taskId !== null) {
      readJsonBody(request, (body) => {
        const taskIndex = findTaskIndex(tasks, taskId);

        if (taskIndex === -1) {
          sendError(response, 404, ["Task not found"]);
          return;
        }

        const validation = validateTaskUpdateInput(body);

        if (!validation.valid) {
          sendError(response, 400, validation.errors);
          return;
        }

        tasks[taskIndex] = updateTask(tasks[taskIndex], body);

        sendJson(response, 200, tasks[taskIndex]);
      }, (errors) => sendError(response, 400, errors));

      return;
    }

    if (request.method === "DELETE" && taskId !== null) {
      const taskIndex = findTaskIndex(tasks, taskId);

      if (taskIndex === -1) {
        sendError(response, 404, ["Task not found"]);
        return;
      }

      tasks.splice(taskIndex, 1);
      sendNoContent(response);
      return;
    }

    response.statusCode = 404;
    response.end();
  });
}

if (require.main === module) {
  const port = process.env.PORT || 3000;

  createTaskServer().listen(port, () => {
    console.log(`Open http://localhost:${port}/tasks`);
  });
}

module.exports = {
  createTaskServer
};
