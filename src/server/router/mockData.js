import express from 'express';
import 'express-async-errors';

import mockAchievementRateItems from "../MockData/mockAchievementRateItems.json" assert { type: "json" }
import mockAnalyticsDatas from "../MockData/mockAnalyticsDatas.json" assert { type: "json" }
import mockAssignmentItems from "../MockData/mockAssignmentItems.json" assert { type: "json" }
import mockAssignmentType from "../MockData/mockAssignmentType.json" assert { type: "json" }
import mockDifficultyItems from "../MockData/mockDifficultyItems.json" assert { type: "json" }
import mockFeedbackData from "../MockData/mockFeedbackData.json" assert { type: "json" }
import mockFilterItems from "../MockData/mockFilterItems.json" assert { type: "json" }
import mockInfoCategories from "../MockData/mockInfoCategories.json" assert { type: "json" }
import mockInfoQuestionItems from "../MockData/mockInfoQuestionItems.json" assert { type: "json" }
import mockLanguageItems from "../MockData/mockLanguageItems.json" assert { type: "json" }
import mockMilestoneitems from "../MockData/mockMilestoneitems.json" assert { type: "json" }
import mockModuleData from "../MockData/mockModuleData.json" assert { type: "json" }
import mockNotiChecked from "../MockData/mockNotiChecked.json" assert { type: "json" }
import mockNotifications from "../MockData/mockNotifications.json" assert { type: "json" }
import mockNumberOfQuestions from "../MockData/mockNumberOfQuestions.json" assert { type: "json" }
import mockPracticeItems from "../MockData/mockPracticeItems.json" assert { type: "json" }
import mockProfile from "../MockData/mockProfile.json" assert { type: "json" }
import mockProgressData from "../MockData/mockProgressData.json" assert { type: "json" }
import mockQuestionData from "../MockData/mockQuestionData.json" assert { type: "json" }
import mockShowMeChecked from "../MockData/mockShowMeChecked.json" assert { type: "json" }
import mockStudentModuleItems from "../MockData/mockStudentModuleItems.json" assert { type: "json" }
import mockStudents from "../MockData/mockStudents.json" assert { type: "json" }
import mockTooltipItems from "../MockData/mockTooltipItems.json" assert { type: "json" }
import mockTopicItems from "../MockData/mockTopicItems.json" assert { type: "json" }
import mockTopMasteries from "../MockData/mockTopMasteries.json" assert { type: "json" }
import mockUsers from "../MockData/mockUsers.json" assert { type: "json" }
import mockWeekProgressItems from "../MockData/mockWeekProgressItems.json" assert { type: "json" }
import mockQuestionCategoryItems from "../MockData/mockInfoCategoryQuestionItems.json" assert { type: "json" }

const router = express.Router();

router.get('/mockAchievementRateItems', (req, res) => {
    res.status(200).json(mockAchievementRateItems);
});

router.get('/mockAnalyticsDatas', (req, res) => {
    res.status(200).json(mockAnalyticsDatas);
});

router.get('/mockAssignmentItems', (req, res) => {
    res.status(200).json(mockAssignmentItems);
});

router.get('/mockAssignmentType', (req, res) => {
    res.status(200).json(mockAssignmentType);
});

router.get('/mockDifficultyItems', (req, res) => {
    res.status(200).json(mockDifficultyItems);
});

router.get('/mockFeedbackData', (req, res) => {
    res.status(200).json(mockFeedbackData);
});

router.get('/mockFilterItems', (req, res) => {
    res.status(200).json(mockFilterItems);
});

router.get('/mockInfoCategories', (req, res) => {
    res.status(200).json(mockInfoCategories);
});

router.get('/mockInfoQuestionItems', (req, res) => {
    res.status(200).json(mockInfoQuestionItems);
});

router.get('/mockLanguageItems', (req, res) => {
    res.status(200).json(mockLanguageItems);
});

router.get('/mockMilestoneitems', (req, res) => {
    res.status(200).json(mockMilestoneitems);
});

router.get('/mockModuleData', (req, res) => {
    res.status(200).json(mockModuleData);
});

router.get('/mockNotiChecked', (req, res) => {
    res.status(200).json(mockNotiChecked);
});

router.get('/mockNotifications', (req, res) => {
    res.status(200).json(mockNotifications);
});

router.get('/mockNumberOfQuestions', (req, res) => {
    res.status(200).json(mockNumberOfQuestions);
});

router.get('/mockPracticeItems', (req, res) => {
    res.status(200).json(mockPracticeItems);
});

router.get('/mockProfile', (req, res) => {
    res.status(200).json(mockProfile);
});

router.get('/mockProgressData', (req, res) => {
    res.status(200).json(mockProgressData);
});

router.get('/mockQuestionData', (req, res) => {
    res.status(200).json(mockQuestionData);
});

router.get('/mockShowMeChecked', (req, res) => {
    res.status(200).json(mockShowMeChecked);
});

router.get('/mockStudentModuleItems', (req, res) => {
    res.status(200).json(mockStudentModuleItems);
});

router.get('/mockStudents', (req, res) => {
    res.status(200).json(mockStudents);
});

router.get('/mockTooltipItems', (req, res) => {
    res.status(200).json(mockTooltipItems);
});

router.get('/mockTopicItems', (req, res) => {
    res.status(200).json(mockTopicItems);
});

router.get('/mockTopMasteries', (req, res) => {
    res.status(200).json(mockTopMasteries);
});

router.get('/mockUsers', (req, res) => {
    res.status(200).json(mockUsers);
});

router.get('/mockWeekProgressItems', (req, res) => {
    res.status(200).json(mockWeekProgressItems);
});

router.get('/mockQuestionCategoryItems', (req, res) => {
    res.status(200).json(mockQuestionCategoryItems);
});

export default router;