# Frontend App Documentation

Welcome to the documentation for Gamify Geeks! This README provides an overview of the project's source code, components, and pages.

## Table of Contents

-   [Frontend App Documentation](#frontend-app-documentation)
    -   [Table of Contents](#table-of-contents)
    -   [Project Structure](#project-structure)
    -   [Components](#components)
        -   [Achievement Card](#achievement-card)
        -   [Add Students Popup](#add-students-popup)
        -   [Assignment Card](#assignment-card)
        -   [Attempted Question Card](#attempted-question-card)
        -   [Badge Notification](#badge-notification)
        -   [Bar Chart](#bar-chart)
        -   [Class Card](#class-card)
        -   [Confirm Reset](#confirm-reset)
        -   [Content Header](#content-header)
        -   [Course PopUp](#course-popup)
        -   [Create Class Card](#create-class-card)
        -   [Donut Chart](#donut-chart)
        -   [Embedded IDE](#embedded-ide)
        -   [Feedback Popup](#feedback-popup)
        -   [HintPopup](#hintpopup)
        -   [InfoQuestionBox](#infoquestionbox)
        -   [InstitutionCodePopup](#institutioncodepopup)
        -   [Iso Loading](#iso-loading)
        -   [Landing Navbar](#landing-navbar)
        -   [Leaderboard](#leaderboard)
        -   [Loading](#loading)
        -   [Menu](#menu)
        -   [Module](#module)
        -   [ModuleBox For Student](#modulebox-for-student)
        -   [Navbar](#navbar)
        -   [Notifications Popup](#notifications-popup)
        -   [Password Popup](#password-popup)
        -   [PopupOverlay](#popupoverlay)
        -   [PracticeCard](#practicecard)
        -   [Profile](#profile)
        -   [Progress Bar](#progress-bar)
        -   [Progress Card](#progress-card)
        -   [Progress Card Empty](#progress-card-empty)
        -   [Progress Popup](#progress-popup)
        -   [Question Details Card](#question-details-card)
        -   [Report Popup](#report-popup)
        -   [Small Toggle Button](#small-toggle-button)
        -   [Students Table](#students-table)
        -   [Sub Menu](#sub-menu)
        -   [Test](#test)
        -   [Thumb Toggle Button](#thumb-toggle-button)
        -   [Toast](#toast)
        -   [Toggle Button](#toggle-button)
        -   [Toggle Card](#toggle-card)
        -   [Tooltip](#tooltip)
        -   [Tooltip Items](#tooltip-items)
        -   [TopRank Card](#toprank-card)
    -   [Contexts](#contexts)
        -   [Auth Context](#auth-context)
        -   [Data Context](#data-context)
        -   [HelpMode Context](#helpmode-context)
        -   [NeedAccount Context](#needaccount-context)
        -   [Popup Context](#popup-context)
        -   [Profile Context](#profile-context)
    -   [Hook](#hook)
        -   [useToggle](#usetoggle)
        -   [useLoading](#useloading)
    -   [Network](#network)
        -   [HTTP](#http)
    -   [Pages](#pages)
        -   [Account](#account)
        -   [Analytics](#analytics)
        -   [ClassOverview](#classoverview)
        -   [ContentBox](#contentbox)
        -   [Dashboard](#dashboard)
        -   [Explore](#explore)
        -   [Help](#help)
        -   [Home](#home)
        -   [Info](#info)
        -   [Landing](#landing)
        -   [Landing Content Box](#landing-content-box)
        -   [Login](#login)
        -   [Login Container](#login-container)
        -   [Main Content](#main-content)
        -   [Modules](#modules)
        -   [Modules Container](#modules-container)
        -   [Modules For Instructor](#modules-for-instructor)
        -   [NotFound](#notfound)
        -   [Protected Route](#protected-route)
        -   [Providers](#providers)
        -   [Question](#question)
        -   [Reset Password](#reset-password)
        -   [Sidebar](#sidebar)
        -   [Signup](#signup)
        -   [Students](#students)
        -   [Students Container](#students-container)
    -   [Services](#services)
        -   [Auth](#auth)
        -   [Data](#data)
        -   [Mock Data](#mock-data)
        -   [Test](#test-1)

## Project Structure

The frontend app is organized into the following directories:

-   `src`: Contains the main source code of the application.
    -   `components`: Contains reusable UI elements and functional components used throughout the app's various pages and features.
    -   `context`: Holds context providers and consumers that enable the sharing of state and functionality across components without having to pass props explicitly.
    -   `hook`: Accommodates custom React hooks, which encapsulate logic and state management that can be shared across multiple components for improved code organization and reusability.
    -   `network`: Houses modules responsible for preparing network requests handling and API communication.
    -   `page`: ontains individual components that represent distinct pages of the application, each encapsulating its own UI and functionality.
    -   `service`: Contains modularized code responsible for handling data fetching, interacting with APIs, and managing application logic related to external services.

## Components

### Achievement Card

A component displaying a user's achievements or milestones within the application, providing visual recognition and motivation.

### Add Students Popup

A popup component facilitating the addition of students to a class or group, often used by educators or administrators.

### Assignment Card

Displays information about an assignment or task, showing details such as due date, title, and description.

### Attempted Question Card

Presents a question that a user has attempted, along with relevant details like correctness, points earned, etc.

### Badge Notification

Renders a notification related to earning badges, rewards, or accomplishments in the application.

### Bar Chart

Displays data in a bar chart format, providing a visual representation of numerical information.

### Class Card

Represents a class or course with essential information like name, instructor, and schedule.

### Confirm Reset

Offers a confirmation popup for resetting or reverting changes, requiring user confirmation before proceeding.

### Content Header

Renders a header section for content, often used to provide context or a title for a specific section of the application.

### Course PopUp

A popup component displaying course-related information, options, or settings.

### Create Class Card

Helps users create a new class or group, providing fields for class details and configuration.

### Donut Chart

Displays data using a donut chart style, offering a circular visualization of data proportions or percentages.

### Embedded IDE

Provides an integrated development environment (IDE) within the app for coding, scripting, or content creation.

### Feedback Popup

Shows a popup allowing users to provide feedback, suggestions, or comments about their experience.

### HintPopup

Displays hints or tips to assist users in understanding complex concepts or tasks.

### InfoQuestionBox

Presents a question along with additional contextual information, assisting users in making informed choices.

### InstitutionCodePopup

A popup for entering an institution-specific code or identifier, often used for verification or enrollment.

### Iso Loading

Renders a loading indicator or animation, indicating that a process or action is in progress.

### Landing Navbar

Navigation bar specific to the landing or home page of the application, providing links to key sections.

### Leaderboard

Shows a ranking of users based on their achievements, scores, or contributions.

### Loading

Renders a general loading indicator, conveying that the application is fetching or processing data.

### Menu

Provides a menu interface with navigation options, often displayed as a dropdown or sidebar.

### Module

Represents a modular unit of content or functionality within the application.

### ModuleBox For Student

Displays a module's content specifically for students, often showing lessons, quizzes, or materials.

### Navbar

Displays a navigation bar with links to different sections of the application.

### Notifications Popup

A popup that shows notifications for events, updates, or messages.

### Password Popup

A popup for changing or resetting passwords, requiring user authentication.

### PopupOverlay

Covers the background with a semi-transparent overlay when a popup is active, emphasizing the popup's content.

### PracticeCard

Displays practice questions or exercises, providing users a way to enhance their skills.

### Profile

Displays user profile information, settings, and options for customization.

### Progress Bar

Represents progress visually using a horizontal bar, often indicating completion of a task or achievement.

### Progress Card

Displays a user's progress, achievements, or statistics for a specific area or module.

### Progress Card Empty

Similar to "ProgressCard," but displays an empty state when no progress or data is available.

### Progress Popup

A popup presenting detailed progress information or analytics to the user.

### Question Details Card

Displays comprehensive details of a question, including options, explanations, and related content.

### Report Popup

Offers the option to report content, users, or issues, often including a form for details.

### Small Toggle Button

Renders a small toggle button or switch that can be activated or deactivated.

### Students Table

Displays a table of student information, often used by educators or administrators.

### Sub Menu

Represents a secondary menu or navigation within a larger section of the application.

### Test

Represents a test or examination, providing settings, options, and questions.

### Thumb Toggle Button

Renders a toggle button with thumb-like icons for visual indication of status.

### Toast

Displays brief notifications or messages that appear temporarily, often at the bottom of the screen.

### Toggle Button

Renders a standard toggle button or switch that can be activated or deactivated.

### Toggle Card

Displays a card-style toggle switch, often used for enabling or disabling a feature.

### Tooltip

Displays additional information or context when users hover over or interact with specific elements.

### Tooltip Items

Displays a list of items with tooltips, enhancing user understanding of each item's purpose.

### TopRank Card

Displays the top-ranking users or entities, often with avatars, scores, or badges.

## Contexts

### Auth Context

A context providing authentication-related state and functions, enabling components to manage user authentication and authorization.

### Data Context

A context designed for managing global data state, allowing components to access and modify shared data throughout the application.

### HelpMode Context

A context that manages the state related to a help or tutorial mode, facilitating user guidance and assistance within the app.

### NeedAccount Context

A context that handles the state and actions related to user account creation or registration needs.

### Popup Context

A context responsible for managing the display and behavior of popups or modal dialogs within the application.

### Profile Context

A context providing access to user profile data and functionality, allowing components to interact with and update profile information.

## Hook

### useToggle

A custom hook that provides a boolean state and functions to toggle it between true and false, useful for managing simple toggling behavior in components.

### useLoading

A custom hook that manages loading state, offering functions to set loading status, often used to handle asynchronous actions and display loading indicators.

## Network

### HTTP

Responsible for making various HTTP requests with error handling and authentication event notifications. It includes methods for performing GET, POST, PUT, and DELETE requests, along with functionality to handle stream responses and process JSON data. The class encapsulates the logic needed to interact with a specified base URL and manages errors and authentication-related events through the provided authErrorEventBus.

## Pages

### Account

Page dedicated to managing user account settings, preferences, and information.

### Analytics

Page presenting data-driven insights and statistics, often related to user activity or application usage.

### ClassOverview

Page offering an overview of a specific class or course, displaying information such as schedule, assignments, and enrolled students.

### ContentBox

Page section or container focusing on presenting specific content, often used to display detailed information or resources.

### Dashboard

Main page providing a comprehensive view of the application's key features, data, and user actions.

### Explore

Page designed for users to discover new content, resources, or features within the application.

### Help

Page dedicated to providing assistance, guidance, or tutorials to users seeking help with using the application.

### Home

Landing or main page of the application, often providing an introduction and navigation to different sections.

### Info

Page displaying informational content, explanations, or context about certain features or concepts.

### Landing

Initial landing page welcoming users to the application, often showcasing key features and benefits.

### Landing Content Box

Content section specific to the landing page, highlighting important details or offerings.

### Login

Page where users can authenticate and log into their accounts.

### Login Container

Page section containing login-related components, often used within the main login page.

### Main Content

Central content area of a page, often housing the main features or information.

### Modules

Page presenting a list or overview of available modules, sections, or units within a course or curriculum.

### Modules Container

Page section containing modules-related components, often used within the main Modules page.

### Modules For Instructor

Page displaying modules specifically for instructors, often offering options for editing or managing content.

### NotFound

Page shown when a user navigates to a non-existent or inaccessible route, providing feedback about the error.

### Protected Route

Special page component that wraps around routes requiring user authentication or authorization, ensuring access control.

### Providers

Page section for managing data providers, often related to external integrations or services.

### Question

Page presenting a single question or a set of questions, often used in educational or quiz applications.

### Reset Password

Page allowing users to initiate the password reset process.

### Sidebar

Page section providing navigation or contextual options typically displayed on the side of the main content.

### Signup

Page where users can create new accounts or register for the application.

### Students

Page displaying information, statistics, or profiles related to students or learners using the application.

### Students Container

Page section containing students-related components, often used within the main Students page.

## Services

### Auth

Service handling authentication-related functionalities, such as user login, registration, and token management.

### Data

Service responsible for managing and interacting with various data sources, APIs, or databases, providing data fetching and manipulation capabilities.

### Mock Data

Service providing mock or simulated data for development and testing purposes, enabling the application to function without real data sources.

### Test

Service or module containing utilities and functions for testing, often including test data generation, assertion methods, and testing framework integrations.
