import pool from "../connection/sqlconnect.js";
import * as utils from "../Utils/utils.js";
import * as question from "../data/questions.js";

export async function topicCards(search, lang, pg, pageLength) {
  try {
    let offset = 0;
    if (Number(pg) >= 1) {
      offset = Number(pageLength) * (Number(pg) - 1);
    }
    const sql = `SELECT Topic.name AS Topic, Topic.topicId as Id, Topic.bugsReported,
        GROUP_CONCAT(ProgrammingLanguage.name, ",", ProgrammingLanguage.programmingLanguageId)  
        AS Language FROM gamifyDb.TopicProgrammingLanguage INNER JOIN gamifyDb.Topic ON TopicProgrammingLanguage.topicId=Topic.topicId  
        INNER JOIN gamifyDb.ProgrammingLanguage ON TopicProgrammingLanguage.programmingLanguageId = ProgrammingLanguage.programmingLanguageId WHERE Topic.name LIKE "%${search}%" GROUP BY Topic.name, Topic.topicId, Topic.bugsReported`;
    const raw = await pool.query(sql);
    const data = raw[0].map((item, index) => {
      return {
        id: item.Id,
        title: item.Topic,
        level: 0,
        numBug: item.bugsReported,
        languages: utils.pairGrab(item.Language.split(",")),
      };
    });
    const unLimited = utils.filterByLanguageIds(data, lang);
    const result = unLimited.slice(offset, offset + pageLength);
    const response = {
      totalCards: unLimited.length,
      topicCards: result,
    };
    return response;
  } catch (err) {
    console.log(err);
    return { error: "Failed to retrieve Topics based on Language" };
  }
}

export async function questionDetails() {
  try {
    const raw = await pool.query(
      "SELECT Topic.name AS Topic, QuestionPrompt.questionPromptId AS promptId, Question.textContent AS Question, ProgrammingLanguage.name AS Language, ProficiencyLevel.name AS Difficulty  FROM gamifyDb.Topic RIGHT JOIN gamifyDb.QuestionPrompt ON Topic.topicId = QuestionPrompt.topicId RIGHT JOIN gamifyDb.Question ON QuestionPrompt.questionPromptId = Question.questionPromptId Left JOIN gamifyDb.ProgrammingLanguage ON QuestionPrompt.programmingLanguageId = ProgrammingLanguage.programmingLanguageId LEFT JOIN gamifyDb.ProficiencyLevel ON QuestionPrompt.proficiencyLevelId = ProficiencyLevel.proficiencyLevelId"
    );
    const data = raw[0].map((item, index) => {
      return {
        id: index + 1,
        topic: item.Topic,
        language: item.Language,
        question: item.Question,
        difficulty: item.Difficulty,
        promptId: item.promptId,
      };
    });
    return data;
  } catch (err) {
    console.log(err);
    return { error: "Failed to get Question Details" };
  }
}

export async function languages() {
  try {
    const raw = await pool.query(
      "SELECT ProgrammingLanguage.name AS Language, ProgrammingLanguage.iconpath AS IconPath, ProgrammingLanguage.programmingLanguageId AS Id FROM gamifyDb.ProgrammingLanguage"
    );
    const data = raw[0].map((item, index) => {
      return {
        id: item.Id,
        name: item.Language,
        iconPath: item.IconPath,
      };
    });
    return data;
  } catch (err) {
    console.log(err);
    return { error: "Failed to get Programming Languages" };
  }
}

export async function difficulties() {
  try {
    const raw = await pool.query("SELECT ProficiencyLevel.name AS Difficulty, ProficiencyLevel.proficiencyLevelId AS Id FROM gamifyDb.ProficiencyLevel");
    const data = raw[0].map((item, index) => {
      return {
        id: item.Id,
        name: item.Difficulty,
      };
    });
    return data;
  } catch (err) {
    console.log(err);
    return { error: "Failed to get Difficulties" };
  }
}

export async function languagesByTopic(topicId) {
  try {
    const sql = `SELECT Topic.name AS Topic, Topic.topicId as Id,  
        GROUP_CONCAT(ProgrammingLanguage.name, ',', ProgrammingLanguage.programmingLanguageId)  
        AS Language FROM gamifyDb.TopicProgrammingLanguage INNER JOIN gamifyDb.Topic ON TopicProgrammingLanguage.topicId=Topic.topicId  
        INNER JOIN gamifyDb.ProgrammingLanguage ON TopicProgrammingLanguage.programmingLanguageId = ProgrammingLanguage.programmingLanguageId WHERE Topic.topicId = ${topicId} GROUP BY Topic.name, Topic.topicId`;
    const raw = await pool.query(sql);
    const data = raw[0].map((item, index) => {
      return utils.pairGrab(item.Language.split(","));
    });
    return data[0];
  } catch (err) {
    console.log(err);
    return { error: "Failed to get languages by topicId" };
  }
}

export function extractYearMonthDay(dateString) {
  // Parse the input date string into a Date object
  const date = new Date(dateString);

  // Get the year, month, and day from the Date object
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");

  // Return the formatted date string in the form "yyyy-mm-dd"
  return String(`${year}-${month}-${day}`);
}

export async function attemptedQuestions(userId) {
  try {
    const sql = `SELECT Question.questionId AS QuestionId, LearnerQuestions.dateCompleted AS StartDate, Question.textContent AS Question, Topic.name AS Topic, Topic.topicId AS TopicID, ProgrammingLanguage.name AS Languages, ProgrammingLanguage.programmingLanguageId AS langId, ProficiencyLevel.name AS Difficulty, ProficiencyLevel.proficiencyLevelId AS DiffID
        FROM gamifyDb.LearnerQuestions 
        LEFT JOIN gamifyDb.Question ON LearnerQuestions.questionId = Question.questionId 
        LEFT JOIN gamifyDb.QuestionPrompt ON Question.questionPromptId=QuestionPrompt.questionPromptId
        LEFT JOIN gamifyDb.Topic ON QuestionPrompt.topicId = Topic.topicId
        LEFT JOIN gamifyDb.ProgrammingLanguage ON QuestionPrompt.programmingLanguageId = ProgrammingLanguage.programmingLanguageId
        LEFT JOIN gamifyDb.ProficiencyLevel ON QuestionPrompt.proficiencyLevelId = ProficiencyLevel.proficiencyLevelId
        WHERE LearnerQuestions.completed = 0 AND LearnerQuestions.userID = ${userId} AND Question.active = 1;`;
    const raw = await pool.query(sql);
    const data = raw[0].map((item) => {
      let date = extractYearMonthDay(item.StartDate);
      return {
        questionId: item.QuestionId,
        startDate: date,
        textContent: item.Question,
        topic: item.Topic,
        topicId: item.TopicID,
        language: item.Languages,
        languageId: item.langId,
        difficulty: item.Difficulty,
        difficultyId: item.DiffID,
      };
    });
    if (data == null || data.length < 1) {
      return [];
    }
    return data;
  } catch (err) {
    console.log(err);
    return { error: "Failed to get attempted questions" };
  }
}
