const TITLE_REQUIRED_ERROR = "Title is required";

function getNormalizedTitle(input) {
  return input?.title?.trim() || "";
}

function normalizeTaskFields(input) {
  return {
    title: input.title.trim(),
    description: input.description.trim()
  };
}

function validateTaskInput(input) {
  const title = getNormalizedTitle(input);

  if (!title) {
    return {
      valid: false,
      errors: [TITLE_REQUIRED_ERROR]
    };
  }

  return {
    valid: true,
    errors: []
  };
}

function createTask(input, id) {
  const normalizedFields = normalizeTaskFields(input);

  return {
    id,
    ...normalizedFields,
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
