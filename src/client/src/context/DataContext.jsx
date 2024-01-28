import { createContext, useCallback, useContext, useMemo } from "react";

const DataContext = createContext({});

const mockMethodNames = [
    // 'getAchievementRate',
    // 'getMilestones',
    // 'getProfile',
    // 'getLanguages',
    // 'getDifficulties',
    // 'getPracticeItems',
    "getFilters",
    "getUsers",
    "getTooltipItems",

    // 'getModuleData',

    // 'getStudents',

    // 'getAnalyticsDatas',
    "getAssignments",
    // 'getMasteries',
    // 'getWeekProgress',
    "getShowMeChecked",
    "getNotiChecked",
    // 'addClass',
    "getTopicCategory",
    // 'getStudentModules',
    "getNotificationData",
    "getNumberOfQuestions",
    "getAssignmentTypes",
    "getQuestionData",
    "getFeedbackData",
    "getProgressData",
    "getInfoQuestion",
    "getInfoCategories",
    "getQuestionCategories",
];

const methodNames = [
    "getProfile",
    "getAchievementRate",
    "getLeaderboardItems",
    "getClasses",
    "updateAccount",
    "getLanguages",
    "getDifficulties",
    "getPracticeItems",
    "getQuestion",
    "getTopicLanguages",
    "submitAnswer",
    "saveAnswer",
    "getMilestones",
    "getHint",
    "reportQuestion",
    "getAttemptedQuestions",
    "joinClass",
    "getMasteries",
    "getClassOverview",
    "createClass",
    "editClass",
    "deleteClass",
    "getStudentModules",
    "getInstructorModules",
    "deleteModule",
    "changeModuleVisibility",
    "createModule",
    "getBadges",
    "changeAssignmentVisibility",
    "deleteAssignment",
    "createAssignment",
    "editAssignment",
    "getStudentQuestions",
    "saveAssignmentQuestion",
    "getStudentAnalytics",
    "getInstructorClassModules",
    "getStudents",
    "getWeekProgress",
    "getClassLeaderboard",
    "getStudentAnalyticsInstructor",
    "getWeekProgressInstructor",
    "getClassLeaderboardInstructor",
    "getTotalStreaks",
    "getMonthStreaks",
    "getUpcomingAssignments",
    "submitAssignmentAnswer",
    "getNotifications",
    "claimNotification",
    "getBadgeTitles",
];

export function DataProvider({ mockDataService, dataService, children }) {
    const createMockGetDataFunction = useCallback((methodName) => async (param) => mockDataService[methodName](param), [mockDataService]);
    const createGetDataFunction = useCallback((methodName) => async (param) => dataService[methodName](param), [dataService]);

    const mockContext = useMemo(() => {
        const methods = mockMethodNames.reduce((acc, methodName) => {
            acc[methodName] = (param) => createMockGetDataFunction(methodName)(param);
            return acc;
        }, {});

        return methods;
    }, [createMockGetDataFunction]);

    const context = useMemo(() => {
        const methods = methodNames.reduce((acc, methodName) => {
            acc[methodName] = (param) => createGetDataFunction(methodName)(param);
            return acc;
        }, {});

        return methods;
    }, [createGetDataFunction]);

    return <DataContext.Provider value={{ ...context, ...mockContext }}>{children}</DataContext.Provider>;
}

export const useData = () => useContext(DataContext);
