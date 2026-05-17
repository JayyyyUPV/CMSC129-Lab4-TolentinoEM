const TITLE_REQUIRED_ERROR = "Title is required";

function hasOwnField(object, field) {
  return Object.prototype.hasOwnProperty.call(object ?? {}, field);
}

function getNormalizedTitle(input) {
  return input?.title?.trim() || "";
}

function getNormalizedDescription(input) {
  return input?.description?.trim() || "";
}

function normalizeTaskFields(input) {
  return {
    title: getNormalizedTitle(input),
    description: getNormalizedDescription(input)
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

function updateTask(task, updates = {}) {
  const safeUpdates = updates ?? {};

  return {
    ...task,
    title: hasOwnField(safeUpdates, "title")
      ? getNormalizedTitle(safeUpdates)
      : task.title,
    description: hasOwnField(safeUpdates, "description")
      ? getNormalizedDescription(safeUpdates)
      : task.description,
    completed: safeUpdates.completed ?? task.completed
  };
}

module.exports = {
  validateTaskInput,
  createTask,
  updateTask
};
