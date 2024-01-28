import { getTopTopics } from "../data/masteries.js";

export async function getMasteries(req, res) {
    const studentId = req.query.studentId;
    const userId = studentId?studentId:req.userId;
    try{
        const result = await getTopTopics(userId);
        if(result) {
            const data = result.map(item => {
                return {
                    id: item.get('topicId'),
                    name: item.get('name')
                    // ,topicCount: item.get('topicCount')
                }
            });
            res.status(200).json(data);
        } else {
            res.status(404).json('Not Found');
        }
    } catch(err) {
        console.log(err);
        res.status(500);
    }
    
}