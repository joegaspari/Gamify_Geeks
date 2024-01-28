# Weekly Log: Scope And Charter Document
## Date May 22 - May 26

This week the goal was to complete the rough draft for the project's Scope and Charter document. 
My contributions included:

    - High level risks section
    - Project purpose
    - Summary Budget



# Weekly Log: Design Document
## Date May 29 - June 2

This week the goal was to complete the rough draft of our design document this included building all UML, sequence, ER and activity diagrams. My contributions inculded:

    - Project Description
    - Building user personas
    - Building use case diagram

---

# Weekly Log: Design Document + Architecture + UI Mockups
## Date June 2 - 11

This weeks goals were to revise the design document (lots of changes needed to be made), I was also responsible for creating the design presentation slides that were used in our Friday presentation (with help from Alrick). My contributions this week include: 

    - Building design presentation slide set (10hrs)
    - Making changes to User Personas (5.5hrs)
    - Making Changes to use case diagram (3.5hrs)
    - Re-designing the UI (15hrs)

## On This Week:

    - Investigate Digital Ocean Set up
    - Set Up CI workflow with github Actions
    - Install Docker on Digital Ocean Droplet
    - Set up Server tests for start up
    - Add linter to our project

---

# Weekly Log: Linter & Learning
## Date June 12-19

This weeks goal was to implement the linter, as well as completing external learning on node js and react js,

    - Investigated Digital Ocean set up (1hrs)
    - Installed Docker on Digital Ocean droplet (1hrs)
    - Investigated ES lint for front and back end linting (2.5hrs)
    - Added linter to front end (2.5hrs)
    - Added linter to back end (2.5hrs)
    - Fixed Backend linter issues (2.5hrs)
  
## On This Week:

    - Investigate Open AI integration
    - Build out Open AI config
    - Add Open AI connection
    - Implement API Calls to fetch coding questions
    - Begin AI prompt engineering
    - Test open AI API return statement
    - Generate list of difficulty 
    - Generate list of topics
    - Generate list of topics based on programming language
    - Add All dummy data to SQL file
  
  ---

# Weekly Log: Open AI and Dummy Data
## Date June 19-26

This weeks goal was to investigate the Open AI API as well as begin prompt engineering for grabbing coding questions from the API. I also created three tables worth of dummy data for topics, languages and topics related to languages as well as the difficulty.

    - Investigate Open AI integration (1.5hrs)
    - Build out Open AI config (2hrs)
    - Add Open AI connection (0.5hrs)
    - Implement API Calls to fetch coding questions (1hrs)
    - Begin AI prompt engineering (2hrs)
    - Test open AI API return statement (1hrs)
    - Generate list of difficulty (2hrs)
    - Generate list of topics (2hrs)
    - Generate list of topics based on programming language (2.5hrs)
    - Add All dummy data to SQL file (1hrs)
  
## On This Week:

    - Add dummy questions to the database (4hrs)
    - Learn best practices for creating API calls to node backend
    - Design question feedback system


# Weekly Log: Implement Explore Page API's and Data Flow

## Date June 26 - July 3

This weeks goal was to complete the sign in/sign up, registration, User Dashboard, Explore page, Question Generation logic, and Answer Generation Logic functionality for the MVP. My Tasks were to complete the API's for the explore page, the question generation page and the logic behind the generation of answers from OpenAI API.

    - 5.7a Prepare API routing system (1.5hrs)
    - Create SQL Statements to insert data (2hrs)
    - Create Functions to get question data (1hrs)
    - Create functions to push question data (1 hrs)
    - Investigate NLP package for javascript (4hrs)
    - Create SQL statements to filter question data, insert statements to add new data to tables (1hrs)
    - Design algo to check similarity (2hrs)
    - Implement pattern recognition to compare similarity of newly generated question to stored questions (2hrs)
    - Create SQL statements to query appropriate data (4hrs)
    - Design question storage path/process (4hrs)
    - Develop validation for user inputs (1hrs)
    - Build OpenAI API calls for generating answers (4hrs)
    - Generate test user responses (2hrs)

## On This Week:

    - Build MVP Slide Deck
    - Complete APIs for Explore page, and user IDE page
    - Determine feedback system for questions


# Weekly Log: Complete MVP, Begin Automated Testing

## Date July 3 - 10

This weeks goals were to complete a working version of the software for the MVP presentation held on July 5. We completed a presentation slide deck and began testing. 

    - Create MVP presentation (3 hrs)
    - Refactor topic APIs (2 hrs)
    - Refactor question APIs (2 hrs)
    - Build util tests (4 hrs)
    - Build Cosine similarity tests (4 hrs)
    - Build topic API tests (4 hrs)
    - Build question API tests (4 hrs)

## On This Week:
    
    - Finish testing on current code
    - Implement CI/CD
    - Launch working V1 on digital ocean


# Weekly Log: Completed Automated Testing, Fixing Backed API logic, Fixing Database

## Date July 10 - 17

This weeks goals were to complete the automated testing for the current backend code base. This was done using Jest and 80 unit tests have been made, with a coverage above 80%. There were some problems with the back end calls getTopicCards, getQuestions and onSave. These issues have been resolved. The database was changed to include languages that were supported by the in page IDE being used for the front end. Lastly I created a set of SVG badges that will be used in our milestone cards as well as for the language bages.

    - Completed automated tests for backend (4.5hrs)
    - Reconfigure API calls (1hrs)
    - Fix errors in getTopicCards (2hrs)
    - Fix errors in getQuestions (1hrs)
    - Fix errors in onSave (1hrs)
    - Add in new autopopulated data (3hrs)
    - Desgine Milestone Badges (3hrs)
  
  ## On This Week:

    - Begin implementing more API calls for features not completed
    - Build tests for new API calls
    - Build SQL queries for data calls and pushes
    - Reconfigure db to include paths to icon files


# Weekly Log: Polishing V1

## Date July 17-21

This week the goal has been to polish V1's current feature set, as well as fixing bugs.

    - Updated DB to include paths to icons, updated API calls for appropriate data (3hrs)
    - Fixing Question Prompt for Open AI (1hrs)
    - Building in Error control in Open AI calls (1hrs)
    - Building tests for Open AI calls (1hrs)
    - Fixing Icon/Badge Placement  (2hrs)
    - Converting OpenAI API model to GPT-3.5-turbo (3hrs)

## On This Week:
    
    - Create Attempted Question API calls
    - Create Attempted Question API TESTS
    - Create Attempted Questions SQL statements
    - Build Question - topic function
    - Build Question - topic function tests
    - Fix DB (Capitalize languages)
    - Fix DB (Paths to badges)
    - Fix DB (Insert question score into question table)
    - Implement Feedback system
    - Fix Feedback
    - Add Trigger to db for Question removal
    - Add Deleted question table to db
    - Created Hint SQL
    - Created Hint OpenAI call statment (prompt)
    - Created Hint helper methods
    - Create Report functions
    - Create Hint endpoint
    - Create Report API endpoint
    - Create Report SQL 
    - Fix Delete question trigger


# Weekly Log: Creating Report + Hint + Attempted Questions

## Date July 21-28

This week the goal was to create backend logic, tests, and API calls for the hint, report and attemptedQuestions functionality. 

    - Create Attempted Question API calls (3hrs)
    - Create Attempted Question API TESTS (3hrs)
    - Create Attempted Questions SQL statements (1hrs)
    - Build Question - topic function (3hrs)
    - Build Question - topic function tests (1hrs)
    - Fix DB (Capitalize languages) (0.5hrs)
    - Fix DB (Paths to badges)  (0.5hrs)
    - Fix DB (Insert question score into question table) (0.5hrs)
    - Implement Feedback system (2hrs)
    - Fix Feedback (2hrs)
    - Add Trigger to db for Question removal (1hrs)
    - Created Hint SQL (2hrs)
    - Created Hint OpenAI call statment (prompt) (1hrs)
    - Created Hint helper methods (2hrs)
    - Create Report functions (3hrs)
    - Create Hint endpoint (2hrs)
    - Create Report API endpoint (3hrs)
    - Create Report SQL (3hrs)
    - Fix Delete question trigger (3hrs)


## On This Week:
    
    - Create student module API calls
    - Create student module API tests
    - Create student module SQL statements
    - Create instructor module API calls
    - Create instructor module API tests
    - Create instructor module SQL statments
    - Fix DB to include visibility Modules
    - Fix DB to include visibility Assignments
    - Fix DB Assignment Question table to fix FKS
    - Create instructor assignment API calls
    - Create instructor assignment API tests
    - Create instructor assignment SQL


# Weekly Log: Creating Student & Instructor Module, Assignment APIs

## Date July 28 - August 4

This week the goal was to create backend logic, tests, and API calls for the student/instructor module and assignment functionality.

    - Create student module API calls
    - Create student module API tests
    - Create student module SQL statements
    - Create instructor module API calls
    - Create instructor module API tests
    - Create instructor module SQL statments
    - Fix DB to include visibility Modules
    - Fix DB to include visibility Assignments
    - Fix DB Assignment Question table to fix FKS
    - Create instructor assignment API calls
    - Create instructor assignment API tests
    - Create instructor assignment SQL

## On This Week

    - Finish Module API Tests
    - Finish Assignment API Tests
    - Create new API calls for uncompleted features
    - Start Documentation


# Finishing Outstanding Minor APIs & Fixing Bugs

## Date July 4 - August 15

This is our final week of development. All remaining APIs were completed as well as bug fixes to both back end and front ent

## Tasks Completed

    - Finish Module API tests
    - Finish Assignment API tests
    - Finish Titles API
    - Finish StreaK API
    - Finish Calendar API
    - Fix Badge aPI
    - Fix Assignment bugs
    - Fix Module Bugs
    - Fix Question Bugs
    - Create Dashboard acheivent calculations
    - Fix DB triggers