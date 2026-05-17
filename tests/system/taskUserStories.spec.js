const { test, expect } = require("@playwright/test");
const { createTaskServer } = require("../../src/server");

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

      await expect(page.getByTestId("task-title-input")).toBeVisible({ timeout: 1000 });
      await expect(page.getByTestId("task-description-input")).toBeVisible({ timeout: 1000 });
      await expect(page.getByTestId("create-task-button")).toBeVisible({ timeout: 1000 });
    });
  });

  test.describe("User Story 2: view and update my task list", () => {
    test("shows the task list and edit controls", async ({ page }) => {
      await page.goto(baseUrl);

      await expect(page.getByTestId("task-list")).toBeVisible({ timeout: 1000 });
      await expect(page.getByTestId("edit-task-button")).toBeVisible({ timeout: 1000 });
      await expect(page.getByTestId("save-task-button")).toBeVisible({ timeout: 1000 });
    });
  });

  test.describe("User Story 3: delete completed or unnecessary tasks", () => {
    test("shows a delete control for tasks", async ({ page }) => {
      await page.goto(baseUrl);

      await expect(page.getByTestId("delete-task-button")).toBeVisible({ timeout: 1000 });
    });
  });
});
