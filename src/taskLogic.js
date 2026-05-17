const TITLE_REQUIRED_ERROR = "Title is required";

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

function updateTask(task, updates) {
  return {
    ...task,
    title: Object.prototype.hasOwnProperty.call(updates, "title")
      ? getNormalizedTitle(updates)
      : task.title,
    description: Object.prototype.hasOwnProperty.call(updates, "description")
      ? getNormalizedDescription(updates)
      : task.description,
    completed: updates.completed ?? task.completed
  };
}

module.exports = {
  validateTaskInput,
  createTask,
  updateTask
};
