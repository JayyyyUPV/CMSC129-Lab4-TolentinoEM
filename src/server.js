const http = require("http");
const { createTask, validateTaskInput } = require("./taskLogic");

function sendJson(response, statusCode, body) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(body));
}

function sendTasksPage(response) {
  response.statusCode = 200;
  response.setHeader("Content-Type", "text/html");
  response.end(`
    <form>
      <input data-testid="task-title-input" />
      <textarea data-testid="task-description-input"></textarea>
      <button data-testid="create-task-button">Create</button>
    </form>
    <ul data-testid="task-list">
      <li>
        <button data-testid="edit-task-button">Edit</button>
        <button data-testid="save-task-button">Save</button>
        <button data-testid="delete-task-button">Delete</button>
      </li>
    </ul>
  `);
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
    if (request.method === "GET" && request.url === "/tasks") {
      if (request.headers.accept?.includes("text/html")) {
        sendTasksPage(response);
        return;
      }

      sendJson(response, 200, tasks);
      return;
    }

    if (request.method === "POST" && request.url === "/tasks") {
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

module.exports = {
  createTaskServer
};
