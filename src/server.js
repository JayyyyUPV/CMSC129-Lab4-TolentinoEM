const http = require("http");
const { createTask, validateTaskInput } = require("./taskLogic");

const TASKS_PATH = "/tasks";
const TASKS_PAGE_HTML = `
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>Task Manager</title>
    </head>
    <body>
      <main>
        <form>
          <label>
            Title
            <input data-testid="task-title-input" />
          </label>
          <label>
            Description
            <textarea data-testid="task-description-input"></textarea>
          </label>
          <button type="button" data-testid="create-task-button">Create</button>
        </form>
        <ul data-testid="task-list">
          <li>
            <button type="button" data-testid="edit-task-button">Edit</button>
            <button type="button" data-testid="save-task-button">Save</button>
            <button type="button" data-testid="delete-task-button">Delete</button>
          </li>
        </ul>
      </main>
    </body>
  </html>
`;

function wantsHtml(request) {
  return request.headers.accept?.includes("text/html");
}

function sendJson(response, statusCode, body) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(body));
}

function sendTasksPage(response) {
  response.statusCode = 200;
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.end(TASKS_PAGE_HTML);
}

function readBody(request, callback) {
  let rawBody = "";

  request.on("data", (chunk) => {
    rawBody += chunk;
  });
  request.on("end", () => {
    callback(JSON.parse(rawBody));
  });
}

function createTaskServer() {
  const tasks = [];
  let nextId = 1;

  return http.createServer((request, response) => {
    if (request.method === "GET" && request.url === TASKS_PATH) {
      if (wantsHtml(request)) {
        sendTasksPage(response);
        return;
      }

      sendJson(response, 200, tasks);
      return;
    }

    if (request.method === "POST" && request.url === TASKS_PATH) {
      readBody(request, (body) => {
        const validation = validateTaskInput(body);

        if (!validation.valid) {
          sendJson(response, 400, { errors: validation.errors });
          return;
        }

        const task = createTask(body, nextId);
        nextId += 1;
        tasks.push(task);

        sendJson(response, 201, task);
      });

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
