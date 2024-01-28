import * as topic from '../data/topic.js';


export async function getTopicCard(req, res){
    try{
        const search = req.body.search;
        const pgLength = req.body.pageLength;
        const pg = req.body.page;
        const lang = req.body.multiOptions.languages.map((val)=>val.toString());
        const topicCard = await topic.topicCards(search, lang, pg, pgLength);
        res.status(200).json(topicCard);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Failed to retrieve topic cards'});
    }
}


export async function getQuestionDetails(req, res){
    try{
        const qDetails = await topic.questionDetails();
        res.status(200).json(qDetails);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Failed to get question details'});
    }
}

export async function getLanguages(req, res){
    try{
        const qDetails = await topic.languages();
        res.status(200).json(qDetails);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Failed to get languages'});
    }
}

export async function getDifficulty(req, res){
    try{
        const qDetails = await topic.difficulties();
        res.status(200).json(qDetails);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Failed to get difficulties'});
    }
}

export async function getlanguagesByTopic(req, res){
    try{
        const topicId = req.params.topicId;
        const langByTopic = await topic.languagesByTopic(topicId);
        res.status(200).json(langByTopic);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Failed to get languages by topic id'});
    }
}

export async function getAttemptedQuestions(req, res){
    try{
        const userId = req.userId;
        if(!userId){
            throw "missing userId";
        }
        const attemptedQuestions = await topic.attemptedQuestions(userId);
        res.status(200).json(attemptedQuestions);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Failed to get attempted questions'});
    }

}