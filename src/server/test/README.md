# Test Documentation for "assignments.test.js"

## Post /assignments/createAssignment

*Post createAssignment*

This test case sends a POST request to create a new assignment with valid parameters. It expects the response status to be 200 and the "id" field in the response body to be greater than 1.

*Post createAssignment without moduleId*

This test case sends a POST request to create a new assignment without the "moduleId" parameter. It expects the response status to be 400, and the "error" field in the response body to match the error message indicating that all required fields are missing.

*Post createAssignment without name*

This test case sends a POST request to create a new assignment without the "name" parameter. It expects the response status to be 400, and the "error" field in the response body to match the error message indicating that all required fields are missing.

*Post createAssignment without topicId*

This test case sends a POST request to create a new assignment without the "topicId" parameter. It expects the response status to be 400, and the "error" field in the response body to match the error message indicating that all required fields are missing.

*Post createAssignment without diffId*

This test case sends a POST request to create a new assignment without the "diffId" parameter. It expects the response status to be 400, and the "error" field in the response body to match the error message indicating that all required fields are missing.

*Post createAssignment without langId*

This test case sends a POST request to create a new assignment without the "langId" parameter. It expects the response status to be 400, and the "error" field in the response body to match the error message indicating that all required fields are missing.

*Post createAssignment without numberOfQuestions*

This test case sends a POST request to create a new assignment without the "numberOfQuestions" parameter. It expects the response status to be 400, and the "error" field in the response body to match the error message indicating that all required fields are missing.

*Post createAssignment without deadline*

This test case sends a POST request to create a new assignment without the "deadline" parameter. It expects the response status to be 400, and the "error" field in the response body to match the error message indicating that all required fields are missing.

*Post createAssignment without any parameters*

This test case sends a POST request to create a new assignment without providing any parameters. It expects the response status to be 400, and the "error" field in the response body to match the error message indicating that all required fields are missing.

## Post /assignments/assignmentVis

*Post createAssignment*

This test case sends a POST request to change the visibility of an assignment with valid parameters. It expects the response status to be 200, and the "response" field in the response body to indicate that the assignment visibility has been changed.

*Post createAssignment without module id*

This test case sends a POST request to change the visibility of an assignment without the "moduleId" parameter. It expects the response status to be 400, and the "error" field in the response body to match the error message indicating that all required fields are missing.

*Post createAssignment without assignmentId*

This test case sends a POST request to change the visibility of an assignment without the "assignmentId" parameter. It expects the response status to be 400, and the "error" field in the response body to match the error message indicating that all required fields are missing.

*Post createAssignment with no args*

This test case sends a POST request to change the visibility of an assignment without providing any parameters. It expects the response status to be 400, and the "error" field in the response body to match the error message indicating that all required fields are missing.

## Delete /assignment/inactivateA

*delete assignment*

This test case sends a DELETE request to inactivate an assignment with valid parameters. It expects the response status to be 200, and the "response" field in the response body to indicate that the assignment has been deleted.

*delete assignment without moduleId*

This test case sends a DELETE request to inactivate an assignment without the "moduleId" parameter. It expects the response status to be 400, and the "error" field in the response body to match the error message indicating that all required fields are missing.

*delete assignment without assignmentId*

This test case sends a DELETE request to inactivate an assignment without the "assignmentId" parameter. It expects the response status to be 400, and the "error" field in the response body to match the error message indicating that all required fields are missing.

*delete assignment with no params*

This test case sends a DELETE request to inactivate an assignment without providing any parameters. It expects the response status to be 400, and the "error" field in the response body to match the error message indicating that all required fields are missing.

## Post /assignments/linkStudentAssignment

*Post link student assignments*

This test case sends a POST request to link a student to an assignment with valid parameters. It expects the response status to be 200.

*Post link student assignments without assignmentId*

This test case sends a POST request to link a student to an assignment without the "assignmentId" parameter. It expects the response status to be 400, and the "error" field in the response body to match the error message indicating that all required fields are missing.

*Post link student assignments without classId*

This test case sends a POST request to link a student to an assignment without the "classId" parameter. It expects the response status to be 400, and the "error" field in the response body to match the error message indicating that all required fields are missing.

*Post link student assignments without classId*

This test case sends a POST request to link a student to an assignment without providing any parameters. It expects the response status to be 400, and the "error" field in the response body to match the error message indicating that all required fields are missing.

## Post /assignment/saveAssignmentQuestion

*Post save student assignment question answer*

This test case sends a POST request to save a student's assignment question answer with valid parameters. It expects the response status to be 200, and the "affectedRows" field in the response body to indicate the number of affected rows.

*Post save student assignment question answer without assignmentId*

This test case sends a POST request to save a student's assignment question answer without the "assignmentId" parameter. It expects the response status to be 400, and the "error" field in the response body to match the error message indicating that all required fields are missing.

*Post save student assignment question answer without questionId*

This test case sends a POST request to save a student's assignment question answer without the "questionId" parameter. It expects the response status to be 400, and the "error" field in the response body to match the error message indicating that all required fields are missing.

*Post save student assignment question answer without textContent*

This test case sends a POST request to save a student's assignment question answer without the "textContent" parameter. It expects the response status to be 400, and the "error" field in the response body to match the error message indicating that all required fields are missing.

*Post save student assignment question answer without any args*

This test case sends a POST request to save a student's assignment question answer without providing any parameters. It expects the response status to be 400, and the "error" field in the response body to match the error message indicating that all required fields are missing.

## Get /assignment/updateQtime

*start assignment timer*

This test case sends a GET request to start the timer for an assignment question with valid parameters. It expects the response status to be 200, and the response body to be true.

*start assignment timer without questionId*

This test case sends a GET request to start the timer for an assignment question without the "questionId" parameter. It expects the response status to be 400, and the "error" field in the response body to match the error message indicating that all required fields are missing.

*start assignment timer without assignment Id*

This test case sends a GET request to start the timer for an assignment question without the "assignmentId" parameter. It expects the response status to be 400, and the "error" field in the response body to match the error message indicating that all required fields are missing.

*start assignment timer without any args*

This test case sends a GET request to start the timer for an assignment question without providing any parameters. It expects the response status to be 400, and the "error" field in the response body to match the error message indicating that all required fields are missing.

## Upcoming Assignments Test Suite

*fetch upcoming assignments successfully*

This test case sends a POST request to fetch upcoming assignments with valid parameters. It expects the response status to be 200, and the response body to match the expected assignment data.

*upcoming assignments returning empty because 0 questions completed*

This test case sends a POST request to fetch upcoming assignments for a scenario where no questions are completed. It expects the response status to be 200, and the response body to be an empty array.

## POST /assignment/getAssignmentQAnswer

*Post check student assignment question answer*

This test case sends a POST request to check a student's assignment question answer with valid parameters. It expects the response status to be 200.

*Post check student assignment question answer without assignmentID*

This test case sends a POST request to check a student's assignment question answer without the "assignmentId" parameter. It expects the response status to be 400, and the "error" field in the response body to match the error message indicating missing fields.

*Post check student assignment question answer without questionId*

This test case sends a POST request to check a student's assignment question answer without the "questionId" parameter. It expects the response status to be 400, and the "error" field in the response body to match the error message indicating missing fields.

*Post check student assignment question answer without answer*

This test case sends a POST request to check a student's assignment question answer without the "answer" parameter. It expects the response status to be 400, and the "error" field in the response body to match the error message indicating missing fields.

*Post check student assignment question answer without any arguments*

This test case sends a POST request to check a student's assignment question answer without providing any parameters. It expects the response status to be 400, and the "error" field in the response body to match the error message indicating missing fields.

*Post check student assignment question answer without userId*

This test case sends a POST request to check a student's assignment question answer without proper authorization. It expects the response status to be 401.

## POST /assignment/editAssignment

*Post edit Assignment*

This test case sends a POST request to edit an assignment with valid parameters. It expects the response status to be 200.

*Post edit Assignment without AssignmentId*

This test case sends a POST request to edit an assignment without the "assignmentId" parameter. It expects the response status to be 400, and the "error" field in the response body to match the error message indicating missing fields.

*Post edit Assignment without name*

This test case sends a POST request to edit an assignment without the "name" parameter. It expects the response status to be 400, and the "error" field in the response body to match the error message indicating missing fields.

*Post edit Assignment without deadline*

This test case sends a POST request to edit an assignment without the "deadline" parameter. It expects the response status to be 400, and the "error" field in the response body to match the error message indicating missing fields.

*Post edit Assignment without arguments*

This test case sends a POST request to edit an assignment without providing any parameters. It expects the response status to be 400, and the "error" field in the response body to match the error message indicating missing fields.

## POST /assignment/getStudentQuestions

*Post getStudentQuestion*

This test case sends a POST request to get student questions for an assignment with valid parameters. It expects the response status to be 200.

*Post getStudentQuestion without assignmentID*

This test case sends a POST request to get student questions for an assignment without the "assignmentId" parameter. It expects the response status to be 400.

*Post getStudentQuestion without Class Id*

This test case sends a POST request to get student questions for an assignment without the "classId" parameter. It expects the response status to be 400.

*Post getStudentQuestion without arguments*

This test case sends a POST request to get student questions for an assignment without providing any parameters. It expects the response status to be 400.

*Post getStudentQuestion without user Auth*

This test case sends a POST request to get student questions for an assignment without proper authorization. It expects the response status to be 401.

---
## POST /assignment/studentStats


*Post get Student Statistics*

This test case sends a POST request to get student statistics with valid parameters. It expects the response status to be 200.

*Post get Student Statistics without classId*

This test case sends a POST request to get student statistics without the "classId" parameter. It expects the response status to be 400.

*Post get Student Statistics without search*

This test case sends a POST request to get student statistics without the "search" parameter. It expects the response status to be 400.

*Post get Student Statistics without any working arguments*

This test case sends a POST request to get student statistics without providing any parameters. It expects the response status to be 400.

*Post get Student Statistics without Instructor Authorization*

This test case sends a POST request to get student statistics without proper authorization. It expects the response status to be 401.


# Testing Documentation for auth.test.js

## POST /auth/login

### Learner login

This test suite verifies the functionality of the learner login process. It sends a POST request to the "/auth/login" endpoint with mock learner credentials and checks the response for correctness. 
1. Send a POST request to "/auth/login" with the following parameters: 
   - `authenticator`: "mockLearner" 
   - `password`: "Test1234!" 
2. Ensure that the response status code is 200. 
3. Verify that the `userId` in the response body matches the expected value of 1. 
4. Confirm that the `userRoleId` in the response body matches the expected value of 1.
### Instructor login

This test suite validates the instructor login functionality. It makes a POST request to the "/auth/login" endpoint using mock instructor credentials and examines the response to ensure accuracy. 
1. Make a POST request to "/auth/login" with the given parameters: 
   - `authenticator`: "mockInstructor" 
   - `password`: "Test1234!" 
2. Validate that the response status code is 200. 
3. Check that the `userId` in the response body matches the expected value of 2. 
4. Verify that the `userRoleId` in the response body corresponds to the expected value of 3.