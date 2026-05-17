const {
  validateTaskInput,
  createTask,
  updateTask
} = require("../../src/taskLogic");

describe("task business logic", () => {
  test("accepts task input with a non-empty title and optional description", () => {
    const result = validateTaskInput({
      title: "Finish CMSC 129 Lab 4",
      description: "Complete the Red-Green-Refactor workflow"
    });

    expect(result).toEqual({
      valid: true,
      errors: []
    });
  });

  test("rejects task input with a blank title", () => {
    const result = validateTaskInput({
      title: "   ",
      description: "This should not be enough"
    });

    expect(result).toEqual({
      valid: false,
      errors: ["Title is required"]
    });
  });

  test("creates a task with normalized fields and an incomplete status", () => {
    const task = createTask(
      {
        title: "  Review unit tests  ",
        description: "  Confirm the Red phase fails for the right reason  "
      },
      1
    );

    expect(task).toEqual({
      id: 1,
      title: "Review unit tests",
      description: "Confirm the Red phase fails for the right reason",
      completed: false
    });
  });

  test("updates only provided task fields while preserving the task id", () => {
    const existingTask = {
      id: 1,
      title: "Draft tests",
      description: "Write failing unit tests",
      completed: false
    };

    const updatedTask = updateTask(existingTask, {
      title: "Draft unit tests",
      completed: true
    });

    expect(updatedTask).toEqual({
      id: 1,
      title: "Draft unit tests",
      description: "Write failing unit tests",
      completed: true
    });
  });
});
