const http = require("http");

function listen(server) {
  return new Promise((resolve) => {
    server.listen(0, resolve);
  });
}

function close(server) {
  return new Promise((resolve) => {
    server.close(resolve);
  });
}

function sendJson(server, method, path, body) {
  return new Promise((resolve, reject) => {
    const { port } = server.address();
    const requestBody = body === undefined ? undefined : JSON.stringify(body);

    const request = http.request(
      {
        hostname: "127.0.0.1",
        port,
        path,
        method,
        headers: {
          Accept: "application/json",
          ...(requestBody
            ? {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(requestBody)
              }
            : {})
        }
      },
      (response) => {
        let rawBody = "";

        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          rawBody += chunk;
        });
        response.on("end", () => {
          resolve({
            statusCode: response.statusCode,
            body: rawBody ? JSON.parse(rawBody) : null
          });
        });
      }
    );

    request.on("error", reject);

    if (requestBody) {
      request.write(requestBody);
    }

    request.end();
  });
}

async function withServer(testBody) {
  const { createTaskServer } = require("../../src/server");
  const server = createTaskServer();

  await listen(server);

  try {
    await testBody(server);
  } finally {
    await close(server);
  }
}

describe("task HTTP routes", () => {
  test("POST /tasks creates a task through the HTTP route and stores it for GET /tasks", async () => {
    await withServer(async (server) => {
      const createResponse = await sendJson(server, "POST", "/tasks", {
        title: "  Write integration tests  ",
        description: "  Cover the route-to-data flow  "
      });

      expect(createResponse.statusCode).toBe(201);
      expect(createResponse.body).toEqual({
        id: 1,
        title: "Write integration tests",
        description: "Cover the route-to-data flow",
        completed: false
      });

      const listResponse = await sendJson(server, "GET", "/tasks");

      expect(listResponse.statusCode).toBe(200);
      expect(listResponse.body).toEqual([createResponse.body]);
    });
  });

  test("POST /tasks returns 400 for a missing title and does not create a task", async () => {
    await withServer(async (server) => {
      const createResponse = await sendJson(server, "POST", "/tasks", {
        title: "   ",
        description: "Cannot be created without a title"
      });

      expect(createResponse.statusCode).toBe(400);
      expect(createResponse.body).toEqual({
        errors: ["Title is required"]
      });

      const listResponse = await sendJson(server, "GET", "/tasks");

      expect(listResponse.statusCode).toBe(200);
      expect(listResponse.body).toEqual([]);
    });
  });
});
