const { test, expect } = require("@playwright/test");
const { createTaskServer } = require("../../src/server");

const EXPECT_TIMEOUT_MS = 1000;

async function expectTestIdVisible(page, testId) {
  await expect(page.getByTestId(testId)).toBeVisible({
    timeout: EXPECT_TIMEOUT_MS
  });
}

test.describe("System tests for README user stories", () => {
  let server;
  let baseUrl;

  test.beforeAll(async () => {
    server = createTaskServer();
    await new Promise((resolve) => {
      server.listen(0, resolve);
    });
    baseUrl = `http://127.0.0.1:${server.address().port}/tasks`;
  });

  test.afterAll(async () => {
    await new Promise((resolve) => {
      server.close(resolve);
    });
  });

  test.describe("User Story 1: create a task with a title and description", () => {
    test("shows controls for entering and saving a new task", async ({ page }) => {
      await page.goto(baseUrl);

      await expectTestIdVisible(page, "task-title-input");
      await expectTestIdVisible(page, "task-description-input");
      await expectTestIdVisible(page, "create-task-button");
    });
  });

  test.describe("User Story 2: view and update my task list", () => {
    test("shows the task list and edit controls", async ({ page }) => {
      await page.goto(baseUrl);

      await expectTestIdVisible(page, "task-list");
      await expectTestIdVisible(page, "edit-task-button");
      await expectTestIdVisible(page, "save-task-button");
    });
  });

  test.describe("User Story 3: delete completed or unnecessary tasks", () => {
    test("shows a delete control for tasks", async ({ page }) => {
      await page.goto(baseUrl);

      await expectTestIdVisible(page, "delete-task-button");
    });
  });
});
