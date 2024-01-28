import Users from "./users.js";
import UserRole from "./userRole.js";
import Topic from "./topic.js";
import ProgrammingLanguage from "./programmingLanguage.js";
import ProficiencyLevel from "./proficiencyLevel.js";
import QuestionPrompt from "./questionPrompt.js";
import Question from "./question.js";
import Notification from "./notification.js";
import Class from "./class.js";
import Module from "./module.js";
import LearnerQuestions from "./learnerQuestions.js";
import Learner from "./learner.js";
import LearnerBadges from "./learnerBadges.js";
import Badge from "./badge.js";
import Institution from "./institution.js";
import Instructor from "./instructor.js";
import ClassNotification from "./classNotification.js";
import ClassStudent from "./classStudent.js";
import BadgeNotification from "./badgeNotification.js";
import Assignment from "./assignment.js";
import AssignmentQuestion from "./assignmentQuestion.js";
import TopicProgrammingLanguage from "./topicProgrammingLanguage.js";
import StudentAssignmentQuestion from "./studentAssignmentQuestion.js";
import Milestone from "./milestone.js";
import UserMilestone from "./userMilestone.js";
import AssignmentStudyLog from "./assignmentStudyLog.js";
// Sequelize is an ORM, this associations file describes relationships between objects/tables
// hasMany and belongsTo are methods that are part of how Sequelize maps JavaScript objects to tables
// The 'as' option defines an alias for the associations

const setAssocations = () => {
    // User CONSTRAINT `FK_15` FOREIGN KEY `FK_1` (`userRoleId`) REFERENCES `UserRole` (`id`)
    Users.belongsTo(UserRole, { foreignKey: "userRoleId", as: "role" });
    UserRole.hasMany(Users, { foreignKey: "userRoleId", as: "role" });

    // QuestionPrompt CONSTRAINT `FK_9` FOREIGN KEY `FK_1` (`topicId`) REFERENCES `Topic` (`id`)
    QuestionPrompt.belongsTo(Topic, { foreignKey: "topicId", as: "topic" });
    Topic.hasMany(QuestionPrompt, { foreignKey: "topicId", as: "questionPrompts" });

    // QuestionPrompt CONSTRAINT `FK_19` FOREIGN KEY `FK_2` (`programmingLanguageId`) REFERENCES `ProgrammingLanguage` (`id`)
    QuestionPrompt.belongsTo(ProgrammingLanguage, { foreignKey: "programmingLanguageId", as: "programmingLanguage" });
    ProgrammingLanguage.hasMany(QuestionPrompt, { foreignKey: "programmingLanguageId", as: "questionPrompts" });

    // QuestionPrompt CONSTRAINT `FK_20` FOREIGN KEY `FK_3` (`proficiencyLevelId`) REFERENCES `ProficiencyLevel` (`id`)
    QuestionPrompt.belongsTo(ProficiencyLevel, { foreignKey: "proficiencyLevelId", as: "proficiencyLevel" });
    ProficiencyLevel.hasMany(QuestionPrompt, { foreignKey: "proficiencyLevelId", as: "questionPrompts" });

    // Question CONSTRAINT `FK_12` FOREIGN KEY `FK_1` (`questionId`) REFERENCES `QuestionPrompt` (`id`)
    Question.belongsTo(QuestionPrompt, { foreignKey: "questionId", as: "questionPrompt" });
    QuestionPrompt.hasMany(Question, { foreignKey: "questionId", as: "questions" });

    // Notification CONSTRAINT `FK_24` FOREIGN KEY `FK_1` (`userId`) REFERENCES `Users` (`id`)
    Notification.belongsTo(Users, { foreignKey: "userId", as: "users" });
    Users.hasMany(Notification, { foreignKey: "userId", as: "notifications" });

    // Module CONSTRAINT `FK_6` FOREIGN KEY `FK_1` (`classId`) REFERENCES `Class` (`id`)
    Module.belongsTo(Class, { foreignKey: "classId", as: "class" });
    Class.hasMany(Module, { foreignKey: "classId", as: "modules" });

    //LearnerCorrectQuestions CONSTRAINT `FK_13` FOREIGN KEY `FK_1` (`userId`) REFERENCES `Learner` (`userId`),
    LearnerQuestions.belongsTo(Learner, { foreignKey: "userId", as: "learner" });
    Learner.hasMany(LearnerQuestions, { foreignKey: "userId", as: "correctQuestions" });

    // LearnerCorrectQuestions CONSTRAINT `FK_28_1` FOREIGN KEY `FK_2` (`questionId`) REFERENCES `Question` (`id`)
    LearnerQuestions.belongsTo(Question, { foreignKey: "questionId", as: "question" });
    Question.hasMany(LearnerQuestions, { foreignKey: "questionId", as: "correctQuestions" });

    // LearnerBadges CONSTRAINT `FK_11` FOREIGN KEY `FK_2` (`userId`) REFERENCES `Learner` (`userId`)
    LearnerBadges.belongsTo(Learner, { foreignKey: "userId", as: "learner" });
    Learner.hasMany(LearnerBadges, { foreignKey: "userId", as: "badges" });

    // LearnerBadges CONSTRAINT `FK_10` FOREIGN KEY `FK_1` (`badgeId`) REFERENCES `Badge` (`id`),
    LearnerBadges.belongsTo(Badge, { foreignKey: "badgeId", as: "badge" });
    Badge.hasMany(LearnerBadges, { foreignKey: "badgeId", as: "learners" });

    // Learner CONSTRAINT `FK_1` FOREIGN KEY `FK_1` (`userId`) REFERENCES `Users` (`id`),
    Users.hasOne(Learner, { foreignKey: "userId", as: "learner" });
    Learner.belongsTo(Users, { foreignKey: "userId", as: "users" });

    // Learner CONSTRAINT `FK_21` FOREIGN KEY `FK_2` (`selectedBadgeTitleId`) REFERENCES `Badge` (`id`)
    Badge.hasMany(Learner, { foreignKey: "selectedBadgeTitleId", as: "learner" });
    Learner.belongsTo(Badge, { foreignKey: "selectedBadgeTitleId", as: "badge" });

    // Instructor CONSTRAINT `FK_2` FOREIGN KEY `FK_1` (`userId`) REFERENCES `Users` (`id`),
    Users.hasOne(Instructor, { foreignKey: "userId", as: "instructor" });
    Instructor.belongsTo(Users, { foreignKey: "userId", as: "users" });

    // Instructor CONSTRAINT `FK_16` FOREIGN KEY `FK_2` (`institutionId`) REFERENCES `Institution` (`id`)
    Institution.hasMany(Instructor, { foreignKey: "institutionId", as: "instructor" });
    Instructor.belongsTo(Institution, { foreignKey: "institutionId", as: "institution" });

    // Class CONSTRAINT `FK_3` FOREIGN KEY `FK_1` (`userId`) REFERENCES `Instructor` (`userId`)
    Instructor.hasMany(Class, { foreignKey: "userId", as: "class" });
    Class.belongsTo(Instructor, { foreignKey: "userId", as: "instructor" });

    // ClassNotification CONSTRAINT `FK_28` FOREIGN KEY `FK_2` (`classId`) REFERENCES `Class` (`id`)
    Class.hasMany(ClassNotification, { foreignKey: "classId", as: "classNotification" });
    ClassNotification.belongsTo(Class, { foreignKey: "classId", as: "class" });

    // ClassStudent CONSTRAINT `FK_5` FOREIGN KEY `FK_2` (`classId`) REFERENCES `Class` (`id`)
    ClassStudent.belongsTo(Class, { foreignKey: "classId", as: "classStudent" });
    Class.hasMany(ClassStudent, { foreignKey: "classId", as: "classStudent" });

    // ClassStudent CONSTRAINT `FK_4` FOREIGN KEY `FK_1` (`userId`) REFERENCES `Learner` (`userId`),
    Learner.hasMany(ClassStudent, { foreignKey: "userId", as: "classStudent" });
    ClassStudent.belongsTo(Learner, { foreignKey: "userId", as: "learner" });

    //ClassNotification CONSTRAINT `FK_27` FOREIGN KEY `FK_1` (`notificationId`, `userId`) REFERENCES `Notification` (`id`, `userId`),
    Notification.hasMany(ClassNotification, { foreignKey: "notificationId", as: "classNotification" });
    ClassNotification.belongsTo(Notification, { foreignKey: "notificationId", as: "classNotification" });

    // BadgeNotification CONSTRAINT `FK_26` FOREIGN KEY `FK_1` (`badgeId`) REFERENCES `Badge` (`id`),
    Badge.hasMany(BadgeNotification, { foreignKey: "badgeId", as: "badgeNotification" });
    BadgeNotification.belongsTo(Badge, { foreignKey: "badgeId", as: "badge" });

    // BadgeNotification CONSTRAINT `FK_26_1` FOREIGN KEY `FK_2` (`notificationId`, `userId`) REFERENCES `Notification` (`id`, `userId`)
    Notification.hasMany(BadgeNotification, { foreignKey: "notificationId", as: "badgeNotification" });
    BadgeNotification.belongsTo(Notification, { foreignKey: "notificationId", as: "notification" });

    // AssignmentQuestion CONSTRAINT `FK_23` FOREIGN KEY `FK_2` (`questionId`) REFERENCES `Assignment` (`id`)
    Assignment.hasMany(AssignmentQuestion, { foreignKey: "assignmentId", as: "assignmentQuestion" });
    AssignmentQuestion.belongsTo(Assignment, { foreignKey: "assignmentId", as: "assignment" });

    // AssignmentQuestion CONSTRAINT `FK_22` FOREIGN KEY `FK_1` (`assignmentId`) REFERENCES `QuestionPrompt` (`id`),
    QuestionPrompt.hasMany(AssignmentQuestion, { foreignKey: "questionId", as: "assignmentQuestion" });
    AssignmentQuestion.belongsTo(QuestionPrompt, { foreignKey: "questionId", as: "questionPrompt" });

    // Assignment CONSTRAINT `FK_7` FOREIGN KEY `FK_1` (`moduleId`) REFERENCES `Module` (`id`),
    Module.hasMany(Assignment, { foreignKey: "moduleId", as: "assignment" });
    Assignment.belongsTo(Module, { foreignKey: "moduleId", as: "module" });

    // Assignment CONSTRAINT `FK_8` FOREIGN KEY `FK_2` (`topicId`) REFERENCES `Topic` (`id`),
    Topic.hasMany(Assignment, { foreignKey: "topicId", as: "assignment" });
    Assignment.belongsTo(Topic, { foreignKey: "topicId", as: "topic" });

    // Assignment CONSTRAINT `FK_17` FOREIGN KEY `FK_3` (`proficiencyLevelId`) REFERENCES `ProficiencyLevel` (`id`),
    ProficiencyLevel.hasMany(Assignment, { foreignKey: "proficiencyLevelId", as: "assignment" });
    Assignment.belongsTo(ProficiencyLevel, { foreignKey: "proficiencyLevelId", as: "proficiencyLevel" });

    // Assignment CONSTRAINT `FK_18` FOREIGN KEY `FK_4` (`programmingLanguageId`) REFERENCES `ProgrammingLanguage` (`id`)
    ProgrammingLanguage.hasMany(Assignment, { foreignKey: "programmingLanguageId", as: "assignment" });
    Assignment.belongsTo(ProgrammingLanguage, { foreignKey: "programmingLanguageId", as: "programmingLanguage" });

    // TopicProgrammingLanguage Many to many
    ProgrammingLanguage.belongsToMany(Topic, { through: "TopicProgrammingLanguage", foreignKey: "programmingLanguageId" });
    Topic.belongsToMany(ProgrammingLanguage, { through: "TopicProgrammingLanguage", foreignKey: "topicId" });

    // StudentAssignmentCorrectQuestion - AssignmentQuestion (Many-to-One)
    StudentAssignmentQuestion.belongsTo(AssignmentQuestion, { foreignKey: ["assignmentId", "questionId"], as: "assignmentQuestion" });

    AssignmentQuestion.hasMany(StudentAssignmentQuestion, { foreignKey: ["assignmentId", "questionId"], as: "studentAssignmentQuestion" });

    // StudentAssignmentCorrectQuestion - ClassStudent (Many-to-One)
    StudentAssignmentQuestion.belongsTo(ClassStudent);
    ClassStudent.hasMany(StudentAssignmentQuestion);

    // BadgeMilestone CONSTRAINT `FK_32` FOREIGN KEY `FK_1` (`badgeId`) REFERENCES `Badge` (`badgeId`) ON UPDATE CASCADE ON DELETE CASCADE
    Badge.hasMany(Milestone, { foreignKey: "badgeId", as: "milestones" });
    Milestone.belongsTo(Badge, { foreignKey: "badgeId", as: "badge" });

    // BadgeMilestone CONSTRAINT `FK_32_3` FOREIGN KEY `FK_3` (`programmingLanguageId`) REFERENCES `ProgrammingLanguage` (`programmingLanguageId`)
    ProgrammingLanguage.hasMany(Milestone, { foreignKey: "programmingLanguageId", as: "milestones" });
    Milestone.belongsTo(ProgrammingLanguage, { foreignKey: "programmingLanguageId", as: "programmingLanguage" });

    // BadgeMilestone CONSTRAINT `FK_32_4` FOREIGN KEY `FK_4` (`proficiencyLevelId`) REFERENCES `ProficiencyLevel` (`proficiencyLevelId`)
    ProficiencyLevel.hasMany(Milestone, { foreignKey: "proficiencyLevelId", as: "milestones" });
    Milestone.belongsTo(ProficiencyLevel, { foreignKey: "proficiencyLevelId", as: "proficiencyLevel" });

    // CONSTRAINT `FK_32_5` FOREIGN KEY `FK_5` (`userId`) REFERENCES `Learner` (`userId`)
    Learner.hasMany(UserMilestone, { foreignKey: `userId`, as: `usermilestones` });
    UserMilestone.belongsTo(Learner, { foreignKey: `userId`, as: `learner` });

    // CONSTRAINT `FK_33_1` FOREIGN KEY `FK_6` (`milestoneId`) REFERENCES `Milestone` (`milestoneId`)
    Milestone.hasMany(UserMilestone, { foreignKey: "milestoneId", as: `usermilestones` });
    UserMilestone.belongsTo(Milestone, { foreignKey: `milestoneId`, as: `milestones` });

    // CONSTRAINT `FK_36` FOREIGN KEY (`userId`,`assignmentId`) REFERENCES `StudentAssignmentQuestion` (`userId`, `assignmentId`)
    AssignmentStudyLog.belongsTo(StudentAssignmentQuestion, { foreignKey: ["userId", "assignmentId"] });
    StudentAssignmentQuestion.hasMany(AssignmentStudyLog, { foreignKey: ["userId", "assignmentId"] });
};

export default setAssocations;
