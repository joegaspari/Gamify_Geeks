import express from "express";
import "express-async-errors";
import { getAchievements } from "../controller/achievements.js";
import { getLeaderboard } from "../controller/leaderboard.js";
import { isAuth } from "../middleware/auth.js";
import { getMilestones } from "../controller/milestone.js";
import { getMasteries } from "../controller/masteries.js";
import * as badgeController from "../controller/badges.js";

const router = express.Router();

router.get("/achievements", isAuth, getAchievements);
router.get("/leaderboard", getLeaderboard);
router.get("/milestones", isAuth, getMilestones);
router.get("/masteries", isAuth, getMasteries);
router.get("/badges", isAuth, badgeController.getDashboardBadges);
router.get("/notifications", isAuth, badgeController.badgeNotifications);
router.put("/claim", isAuth, badgeController.seenNotification);

export default router;
