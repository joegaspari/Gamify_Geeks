import { Sequelize } from "sequelize";
import LearnerQuestions from "../models/learnerQuestions.js";
import Question from "../models/question.js";
import QuestionPrompt from "../models/questionPrompt.js";
import Topic from "../models/topic.js";

export async function getTopTopics(userId) {
    const result = await LearnerQuestions.findAll({
        where: {
          completed: 1,
          userId: userId
        },
        include: [
          {
            model: Question,
            as: 'question',
            include: [
              {
                model: QuestionPrompt,
                as: 'questionPrompt',
                include: [
                  {
                    model: Topic,
                    as: 'topic',
                    attributes: ['topicId', 'name']
                  },
                ],
                attributes: [] // Don't select any extra columns from QuestionPrompt due to GROUP BY error
              },
            ],
            attributes: [] // Don't select any extra columns from Question due to GROUP BY error
          },
        ],
        attributes: [
          [Sequelize.fn('COUNT', Sequelize.col('question.questionPrompt.topic.topicId')), 'topicCount'],
          [Sequelize.col('question.questionPrompt.topic.name'), 'name'],
          [Sequelize.col('question.questionPrompt.topic.topicId'), 'topicId'],
        ],
        group: ['question.questionPrompt.topic.topicId', 'question.questionPrompt.topic.name'],
        order: [[Sequelize.literal('topicCount'), 'DESC']],
        limit: 3,
      });

    return result;
}