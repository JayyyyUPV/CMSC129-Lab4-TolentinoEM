function validateTaskInput(input) {
  const title = input?.title?.trim() || "";

  if (!title) {
    return {
      valid: false,
      errors: ["Title is required"]
    };
  }

  return {
    valid: true,
    errors: []
  };
}

function createTask(input, id) {
  return {
    id,
    title: input.title.trim(),
    description: input.description.trim(),
    completed: false
  };
}

function updateTask(task, updates) {
  return {
    ...task,
    title: updates.title ?? task.title,
    description: updates.description ?? task.description,
    completed: updates.completed ?? task.completed
  };
}

module.exports = {
  validateTaskInput,
  createTask,
  updateTask
};
