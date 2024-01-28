import Learner from "../models/learner.js";
import Users from "../models/users.js";

export async function getLeaderboardData() {
    const learners = await Learner.findAll({
        include: [
            {
                model: Users,
                as: "users",
                required: true,
                attributes: ["firstName", "lastName"],
            },
        ],
        order: [["points", "DESC"]],
        limit: 100,
    });
    return learners;
}
