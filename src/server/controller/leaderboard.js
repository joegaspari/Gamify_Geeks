import { getLeaderboardData } from "../data/leaderboard.js";

export async function getLeaderboard(req, res) {
    try{
        const learners = await getLeaderboardData();
        const data = learners.map((learner, index) => {
            return {
                userId: learner.userId,
                rank: index+1,
                name: learner.users ? `${learner.users.firstName} ${learner.users.lastName}` : 'N/A',
                score: learner.points,
                img: null // this will change later
            }
        })

        res.status(200).json(data);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve leaderboard '});
    }
}