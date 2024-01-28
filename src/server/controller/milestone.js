import { getMilestoneData } from "../data/milestone.js";

export async function getMilestones(req, res) {
    const userId = req.userId || req.query.studentId;

    try {
        const usermilestones = await getMilestoneData(userId);

        const result = usermilestones.map((usermilestone) => ({
            id: usermilestone.milestoneId,
            title: usermilestone.milestones.badge.title,
            progress: usermilestone.progress,
            objective: usermilestone.objective,
            proficiencyLevelId: usermilestone.milestones.badge.proficiencyLevelId,
            iconPath: usermilestone.milestones.imagePath,
            badgePath: usermilestone.milestones.badge.iconpath,
        }));
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(400).send("Bad Request");
    }
}
