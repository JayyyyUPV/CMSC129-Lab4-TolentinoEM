const http = require("http");
const { createTask, validateTaskInput } = require("./taskLogic");

function sendJson(response, statusCode, body) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(body));
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
