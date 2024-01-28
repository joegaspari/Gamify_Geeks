import Milestone from "../models/milestone.js";
import { Sequelize } from "sequelize";
import UserMilestone from "../models/userMilestone.js";
import Badge from "../models/badge.js";

export async function getMilestoneData(userId) {
    const usermilestones = await UserMilestone.findAll({
        where: {
            userId: userId,
            progress: {
                [Sequelize.Op.gt]: 0,
                [Sequelize.Op.lt]: Sequelize.col("objective"),
            },
        },
        limit: 6,
        include: [
            {
                model: Milestone,
                as: "milestones",
                include: [
                    {
                        model: Badge,
                        as: "badge",
                    },
                ],
            },
        ],
    });

    return usermilestones;
}
