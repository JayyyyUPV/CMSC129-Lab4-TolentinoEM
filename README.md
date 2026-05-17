# CMSC129 Lab 4 - Task Manager CRUD App

## App Description

This project is a simple Task Manager CRUD web application built for CMSC 129 Laboratory Assignment 4. Users can create tasks, view the current task list, update task details or completion status, and delete tasks that are no longer needed. The application focuses on one resource only, `Task`, and will be developed using Test-Driven Development through the Red-Green-Refactor cycle.

## User Stories

1. As a student, I want to create a task with a title and description, so that I can record work I need to finish.
2. As a student, I want to view and update my task list, so that I can track changes in my responsibilities.
3. As a student, I want to delete completed or unnecessary tasks, so that my task list stays organized.

## Tech Stack

- Frontend: HTML, CSS, and vanilla JavaScript
- Backend: Node.js with Express
- Data Storage: In-memory array
- Unit Testing: Jest
- Integration Testing: Jest with Supertest
- System Testing: Playwright
- CI/CD: GitHub Actions

## Testing Strategy

### Unit Tests

Unit tests will focus on the isolated task business logic in `src/taskLogic.js` without HTTP requests, browser interaction, or a database. The current Jest tests in `tests/unit/taskLogic.test.js` check that:

- `validateTaskInput()` accepts a task with a non-empty title and optional description.
- `validateTaskInput()` rejects a blank title with the error `Title is required`.
- `createTask()` trims task text fields, assigns the provided `id`, and sets `completed` to `false`.
- `updateTask()` preserves the original task `id` while updating only the provided fields.

These tests currently fail because `src/taskLogic.js` is only a Red phase stub that throws `Not implemented`.

### Integration Tests


### System Tests


## Setup Instructions

### Clone the Repository

```bash
git clone <repository-url>
cd CMSC129-Lab4-TolentinoEM
```

### Install Dependencies

```bash
npm install
```

On Windows PowerShell, use `npm.cmd` if `npm` is blocked by the execution policy:

```bash
npm.cmd install
```

### Run the Application

The application server will be added during the integration and system testing phases. At the current unit testing phase, run the unit tests instead.

```bash
npm start
```

### Run Tests

```bash
npm test
```

On Windows PowerShell:

```bash
npm.cmd test
```

### Run Unit Tests

```bash
npm run test:unit
```

On Windows PowerShell:

```bash
npm.cmd run test:unit
```

### Run Integration Tests

```bash
npm run test:integration
```

### Run System Tests

```bash
npm run test:system
```

## Test Results


### Unit Test Results

#### Commit 1 - `[RED] Unit tests`

Command used:

```bash
npm run test:unit
```

Expected result: failed unit tests because `src/taskLogic.js` only contained Red phase stubs that threw `Not implemented`.

Summary:

- Test Suites: 1 failed, 1 total
- Tests: 4 failed, 4 total
- Failure reason: `Not implemented`

![Red unit test output showing failing task logic tests](images/test-results/unit-red-1.png)

![Red unit test output showing Not implemented errors](images/test-results/unit-red-2.png)

#### Commit 2 - `[GREEN] Implement task validation logic`

Command used:

```bash
npm run test:unit
npm test
```

Expected result: all unit tests passed after implementing only the minimum task logic required by the Red tests.

Summary:

- Test Suites: 1 passed, 1 total
- Tests: 4 passed, 4 total

![Green unit test output using npm run test:unit](images/test-results/unit-green-1.png)

![Green unit test output using npm run test:unit and npm test](images/test-results/unit-green-2.png)

#### Commit 3 - `[REFACTOR] Refactor task normalization logic`

Command used:

```bash
npm.cmd test
```

Expected result: all unit tests still passed after extracting task title and field normalization helpers.

Summary:

- Test Suites: 1 passed, 1 total
- Tests: 4 passed, 4 total

![Refactor unit test output showing tests still passing](images/test-results/unit-refactor.png)


### Integration Test Results

Failed integration test output:
```bash
npm run test:integration
```

Summary:
- Test Suites: 1 failed, 1 total
- Tests: 2 failed, 2 total

![Failed integration test output](images/integration-test-results/Screenshot%202026-05-17%20185947.png)

Passing integration test output:
Command:
```bash
npm run test:integration
```

Summary:
- Test Suites: 1 passed, 1 total
- Tests: 2 passed, 2 total

![Passing integration test output](images/integration-test-results/integration-green.png)

### System Test Results


### Full Test Suite Results


## CI/CD Setup


## Reflection

