const http = require("http");
const { createTask, validateTaskInput } = require("./taskLogic");

function createTaskServer() {
  const tasks = [];
  let nextId = 1;

  return http.createServer((request, response) => {
    if (request.method === "GET" && request.url === "/tasks") {
      response.statusCode = 200;
      response.end(JSON.stringify(tasks));
      return;
    }

    if (request.method === "POST" && request.url === "/tasks") {
      let rawBody = "";

      request.on("data", (chunk) => {
        rawBody += chunk;
      });

      request.on("end", () => {
        const body = JSON.parse(rawBody);
        const validation = validateTaskInput(body);

        if (!validation.valid) {
          response.statusCode = 400;
          response.end(JSON.stringify({ errors: validation.errors }));
          return;
        }

        const task = createTask(body, nextId);
        nextId += 1;
        tasks.push(task);

        response.statusCode = 201;
        response.end(JSON.stringify(task));
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
