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

Unit tests will focus on isolated task business logic without HTTP requests or browser interaction. These tests will cover task validation, task object creation, and task update rules. This level should catch mistakes in the core functions before they are connected to routes or the user interface.

### Integration Tests

Integration tests will verify complete HTTP request-response behavior using Express routes and the task data layer together. These tests will cover creating a task through an API request, retrieving tasks through an API request, and validating error responses for invalid input. This level should catch issues in routing, handlers, response status codes, and JSON response bodies.

### System Tests

System tests will use Playwright to simulate a real user interacting with the app in a browser. Each system test will match one user story from this README: creating a task, viewing/updating tasks, and deleting a task. This level should catch broken UI behavior, missing elements, and wiring problems between the frontend and backend.

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

### Run the Application

```bash
npm start
```

### Run Tests

```bash
npm test
```

### Run Unit Tests

```bash
npm run test:unit
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

Screenshots will be added as each TDD phase is completed.

### Unit Test Results

Pending.

### Integration Test Results

Pending.

### System Test Results

Pending.

### Full Test Suite Results

Pending.

## CI/CD Setup

GitHub Actions will be used to run the test suite automatically on every push to `main`. Red commits are expected to show failing workflow runs, while Green commits are expected to show passing workflow runs. Deployment will be configured later after the application and tests are complete.

## Reflection

This section will be completed in the final documentation commit after the unit, integration, and system TDD cycles are finished.
