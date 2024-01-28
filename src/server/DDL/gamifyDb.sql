CREATE DATABASE IF NOT EXISTS gamifyDb;
SET GLOBAL event_scheduler = ON;

USE gamifyDb;

CREATE TABLE `UserRole`
(
 `userRoleId`   int NOT NULL AUTO_INCREMENT,
 `name` varchar(50) NOT NULL ,

PRIMARY KEY (`userRoleId`)
);
CREATE TABLE `Users`
(
 `userId`         int NOT NULL AUTO_INCREMENT ,
 `username`   varchar(20) NOT NULL ,
 `firstName` varchar(20) NOT NULL,
 `lastName` varchar(20) NOT NULL,
 `email`      varchar(50) NOT NULL ,
 `password`   varchar(255) NOT NULL ,
 `userRoleId` int NOT NULL ,
 `createdOn`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 `deleted` TINYINT(1) DEFAULT 0,
 `deletedOn` DATE,

PRIMARY KEY (`userId`),
KEY `FK_1` (`userRoleId`),
CONSTRAINT `FK_15` FOREIGN KEY `FK_1` (`userRoleId`) REFERENCES `UserRole` (`userRoleId`)
);

CREATE TABLE `Institution`
(
 `institutionId`              int NOT NULL AUTO_INCREMENT,
 `name`            varchar(100) NOT NULL ,
 `institutionCode` varchar(20) NOT NULL ,

PRIMARY KEY (`institutionId`)
);

CREATE TABLE `ProgrammingLanguage`
(
 `programmingLanguageId`   int NOT NULL AUTO_INCREMENT,
 `name` varchar(20) NOT NULL,
 `iconpath` varchar(200),
 
 PRIMARY KEY (`programmingLanguageId`)
);

CREATE TABLE `Topic`
(
 `topicId`   int NOT NULL AUTO_INCREMENT,
 `name` varchar(50) NOT NULL ,
 `views` INT DEFAULT 0,
 `bugsReported` INT default 0,

PRIMARY KEY (`topicId`)
);

CREATE TABLE `TopicProgrammingLanguage` 
(
 `programmingLanguageId` int NOT NULL,
 `topicId` int NOT NULL,
 PRIMARY KEY (`programmingLanguageId`, `topicId`),
 FOREIGN KEY (`programmingLanguageId`) REFERENCES `ProgrammingLanguage`(`programmingLanguageId`),
 FOREIGN KEY (`topicId`) REFERENCES `Topic`(`topicId`)
);

CREATE TABLE `ProficiencyLevel`
(
 `proficiencyLevelId`   int NOT NULL AUTO_INCREMENT,
 `name` varchar(20) NOT NULL ,

PRIMARY KEY (`proficiencyLevelId`)
);


CREATE TABLE `Badge`
(
 `badgeId`        int NOT NULL AUTO_INCREMENT,
 `name`      varchar(50) NOT NULL ,
 `threshold` int NOT NULL ,
 `title`     varchar(50) ,
 `iconpath`  varchar(250) NOT NULL,
 `proficiencyLevelId` INT NOT NULL DEFAULT 0,

PRIMARY KEY (`badgeId`)
);

CREATE TABLE `Instructor`
(
 `userId`        int NOT NULL ,
 `institutionId` int NOT NULL ,

PRIMARY KEY (`userId`),
KEY `FK_1` (`userId`),
CONSTRAINT `FK_2` FOREIGN KEY `FK_1` (`userId`) REFERENCES `Users` (`userId`),
KEY `FK_2` (`institutionId`),
CONSTRAINT `FK_16` FOREIGN KEY `FK_2` (`institutionId`) REFERENCES `Institution` (`institutionId`)
);

CREATE TABLE `Class`
(
 `classId`       int NOT NULL AUTO_INCREMENT,
 `name`     varchar(50) NOT NULL ,
 `description` varchar(256),
 `joinCode` varchar(10) NOT NULL UNIQUE,
 `userId`   int NOT NULL ,
 `created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

PRIMARY KEY (`classId`),
KEY `FK_1` (`userId`),
CONSTRAINT `FK_3` FOREIGN KEY `FK_1` (`userId`) REFERENCES `Instructor` (`userId`)
);

CREATE TABLE `Module`
(
 `moduleId`      int NOT NULL AUTO_INCREMENT,
 `classId` int NOT NULL ,
 `name`    varchar(50) NOT NULL ,
 `active`   BOOLEAN NOT NULL DEFAULT 1,
 `visible`  BOOLEAN NOT NULL DEFAULT 1,
 `status`   int NOT NULL DEFAULT 1,
 `created`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

PRIMARY KEY (`moduleId`),
KEY `FK_1` (`classId`),
CONSTRAINT `FK_6` FOREIGN KEY `FK_1` (`classId`) REFERENCES `Class` (`classId`) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE `Learner`
(
 `userId`               int NOT NULL ,
 `points`               int NOT NULL DEFAULT 0 ,
 `exp`                  int NOT NULL DEFAULT 0,
 `level`                int NOT NULL DEFAULT 1,
 `selectedBadgeTitleId` int NOT NULL DEFAULT 1,

PRIMARY KEY (`userId`),
KEY `FK_1` (`userId`),
CONSTRAINT `FK_1` FOREIGN KEY `FK_1` (`userId`) REFERENCES `Users` (`userId`),
KEY `FK_2` (`selectedBadgeTitleId`),
CONSTRAINT `FK_21` FOREIGN KEY `FK_2` (`selectedBadgeTitleId`) REFERENCES `Badge` (`badgeId`)
);

CREATE TABLE `LearnerStudyLog`
(
    `userId` int NOT NULL,
    `studyDate` DATE NOT NULL,
    `studyHours` DECIMAL(4,2) NOT NULL DEFAULT 0.00,

    PRIMARY KEY(`userId`,`studyDate`),
    KEY `FK_32`(`userId`),
    CONSTRAINT `FK_32` FOREIGN KEY (`userId`) REFERENCES `Learner` (`userId`)
);

CREATE TABLE `QuestionPrompt`
(
 `questionPromptId`                    int NOT NULL AUTO_INCREMENT,
 `topicId`               int NOT NULL ,
 `programmingLanguageId` int NOT NULL ,
 `proficiencyLevelId`    int NOT NULL ,

PRIMARY KEY (`questionPromptId`),
KEY `FK_1` (`topicId`),
CONSTRAINT `FK_9` FOREIGN KEY `FK_1` (`topicId`) REFERENCES `Topic` (`topicId`),
KEY `FK_2` (`programmingLanguageId`),
CONSTRAINT `FK_19` FOREIGN KEY `FK_2` (`programmingLanguageId`) REFERENCES `ProgrammingLanguage` (`programmingLanguageId`),
KEY `FK_3` (`proficiencyLevelId`),
CONSTRAINT `FK_20` FOREIGN KEY `FK_3` (`proficiencyLevelId`) REFERENCES `ProficiencyLevel` (`proficiencyLevelId`)
);

CREATE TABLE `Question`
(
 `questionId`  int NOT NULL AUTO_INCREMENT,
 `textContent` TEXT NOT NULL ,
 `score`       int,
 `questionPromptId`  int NOT NULL ,
 `hint`        TEXT ,
 `active`      BOOLEAN NOT NULL DEFAULT 1 ,
 `assignment`  BOOLEAN NOT NULL DEFAULT 0 ,

PRIMARY KEY (`questionId`),
KEY `FK_1` (`questionPromptId`),
CONSTRAINT `FK_12` FOREIGN KEY `FK_1` (`questionPromptId`) REFERENCES `QuestionPrompt` (`questionPromptId`)
);


CREATE TABLE `Assignment`
(
 `assignmentId`                    int NOT NULL AUTO_INCREMENT,
 `moduleId`              int NOT NULL ,
 `name`                  varchar(50) NOT NULL ,
 `numberOfQuestions`     int NOT NULL ,
 `topicId`               int NOT NULL ,
 `proficiencyLevelId`    int NOT NULL ,
 `programmingLanguageId` int NOT NULL ,
 `createdOn`             TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
 `deadlineDate`          date NOT NULL ,
 `status`                int NOT NULL,
 `visible`               BOOLEAN NOT NULL DEFAULT 1,
 `active`                BOOLEAN NOT NULL DEFAULT 1,
 `sampleQuestion`        TEXT,

PRIMARY KEY (`assignmentId`),
KEY `FK_1` (`moduleId`),
CONSTRAINT `FK_7` FOREIGN KEY `FK_1` (`moduleId`) REFERENCES `Module` (`moduleId`) ON DELETE CASCADE ON UPDATE CASCADE,
KEY `FK_2` (`topicId`),
CONSTRAINT `FK_8` FOREIGN KEY `FK_2` (`topicId`) REFERENCES `Topic` (`topicId`),
KEY `FK_3` (`proficiencyLevelId`),
CONSTRAINT `FK_17` FOREIGN KEY `FK_3` (`proficiencyLevelId`) REFERENCES `ProficiencyLevel` (`proficiencyLevelId`),
KEY `FK_4` (`programmingLanguageId`),
CONSTRAINT `FK_18` FOREIGN KEY `FK_4` (`programmingLanguageId`) REFERENCES `ProgrammingLanguage` (`programmingLanguageId`)
);

CREATE TABLE `AssignmentQuestion`
(
 `assignmentId` int NOT NULL ,
 `questionId`   int NOT NULL ,

PRIMARY KEY (`assignmentId`, `questionId`),
KEY `FK_1` (`assignmentId`),

CONSTRAINT `FK_22` FOREIGN KEY `FK_1` (`assignmentId`) REFERENCES `Assignment` (`assignmentId`),
KEY `FK_2` (`questionId`),
CONSTRAINT `FK_23` FOREIGN KEY `FK_2` (`questionId`) REFERENCES `Question` (`questionId`)
);

CREATE TABLE `Notification`
(
 `notificationId`      int NOT NULL AUTO_INCREMENT,
 `userId`  int NOT NULL ,
 `content` varchar(1000) NOT NULL ,
 `date`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 `status`  TINYINT(1) DEFAULT 0 ,

PRIMARY KEY (`notificationId`, `userId`),
KEY `FK_1` (`userId`),
CONSTRAINT `FK_24` FOREIGN KEY `FK_1` (`userId`) REFERENCES `Users` (`userId`)
);


CREATE TABLE `BadgeNotification`
(
 `notificationId`  int NOT NULL ,
 `userId`         int NOT NULL ,
 `badgeId`        int NOT NULL ,

PRIMARY KEY (`notificationId`, `userId`, `badgeId`),
KEY `FK_1` (`badgeId`),
CONSTRAINT `FK_26` FOREIGN KEY `FK_1` (`badgeId`) REFERENCES `Badge` (`badgeId`),
KEY `FK_2` (`notificationId`, `userId`),
CONSTRAINT `FK_26_1` FOREIGN KEY `FK_2` (`notificationId`, `userId`) REFERENCES `Notification` (`notificationId`, `userId`)
);

CREATE TABLE `ClassStudent`
(
 `userId`  int NOT NULL ,
 `classId` int NOT NULL ,

PRIMARY KEY (`userId`, `classId`),
KEY `FK_1` (`userId`),
CONSTRAINT `FK_4` FOREIGN KEY `FK_1` (`userId`) REFERENCES `Learner` (`userId`) ON DELETE CASCADE,
KEY `FK_2` (`classId`),
CONSTRAINT `FK_5` FOREIGN KEY `FK_2` (`classId`) REFERENCES `Class` (`classId`) ON DELETE CASCADE
);



CREATE TABLE `ClassNotification`
(
 `notificationId`  int NOT NULL ,
 `userId`         int NOT NULL ,
 `classId`        int NOT NULL ,

PRIMARY KEY (`notificationId`, `userId`, `classId`),
KEY `FK_1` (`notificationId`, `userId`),
CONSTRAINT `FK_27` FOREIGN KEY `FK_1` (`notificationId`, `userId`) REFERENCES `Notification` (`notificationId`, `userId`),
KEY `FK_2` (`classId`),
CONSTRAINT `FK_28` FOREIGN KEY `FK_2` (`classId`) REFERENCES `Class` (`classId`)
);

CREATE TABLE `LearnerBadges`
(
 `userId`       int NOT NULL ,
 `badgeId`      int NOT NULL ,
 `dateObtained` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

PRIMARY KEY (`userId`, `badgeId`),
KEY `FK_1` (`badgeId`),
CONSTRAINT `FK_10` FOREIGN KEY `FK_1` (`badgeId`) REFERENCES `Badge` (`badgeId`),
KEY `FK_2` (`userId`),
CONSTRAINT `FK_11` FOREIGN KEY `FK_2` (`userId`) REFERENCES `Learner` (`userId`)
);

CREATE TABLE `LearnerQuestions`
(
 `userId`        int NOT NULL ,
 `questionId`    int NOT NULL ,
 `partialAnswer` TEXT,
 `timeTaken`    DECIMAL(4,2),
 `dateCompleted` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 `completed` TINYINT(1) DEFAULT 0,

PRIMARY KEY (`userId`, `questionId`),
KEY `FK_1` (`userId`),
CONSTRAINT `FK_13` FOREIGN KEY `FK_1` (`userId`) REFERENCES `Learner` (`userId`),
KEY `FK_2` (`questionId`),
CONSTRAINT `FK_28_1` FOREIGN KEY `FK_2` (`questionId`) REFERENCES `Question` (`questionId`)
);

CREATE TABLE StudentAssignmentQuestion
(
 `userId`       int NOT NULL ,
 `classId`      int NOT NULL ,
 `assignmentId` int NOT NULL ,
 `questionId`   int NOT NULL ,
 `partialAnswer` TEXT,
 `timeTaken`    DECIMAL(4,2),
 `dateCreated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 `dateCompleted` TIMESTAMP,
 `completed` TINYINT(1) DEFAULT 0,

PRIMARY KEY (`userId`, `classId`, `assignmentId`, `questionId`),
KEY `FK_2` (`assignmentId`, `questionId`),
CONSTRAINT `FK_31` FOREIGN KEY `FK_2` (`assignmentId`, `questionId`) REFERENCES `AssignmentQuestion` (`assignmentId`, `questionId`),
KEY `FK_2_1` (`userId`, `classId`),
CONSTRAINT `FK_31_1` FOREIGN KEY `FK_2_1` (`userId`, `classId`) REFERENCES `ClassStudent` (`userId`, `classId`)
);

CREATE TABLE Milestone
(
    `milestoneId` int NOT NULL AUTO_INCREMENT,
    `badgeId`   int NOT NULL ,
    `programmingLanguageId`     int NOT NULL ,
    `proficiencyLevelId`    int NOT NULL,
    `imagePath` TEXT NOT NULL,

PRIMARY KEY (`milestoneId`),
KEY `FK_1` (`badgeId`),
CONSTRAINT `FK_32_1` FOREIGN KEY `FK_1` (`badgeId`) REFERENCES `Badge` (`badgeId`) ON UPDATE CASCADE ON DELETE CASCADE,
KEY `FK_3` (`programmingLanguageId`),
CONSTRAINT `FK_32_3` FOREIGN KEY `FK_3` (`programmingLanguageId`) REFERENCES `ProgrammingLanguage` (`programmingLanguageId`),
KEY `FK_4` (`proficiencyLevelId`),
CONSTRAINT `FK_32_4` FOREIGN KEY `FK_4` (`proficiencyLevelId`) REFERENCES `ProficiencyLevel` (`proficiencyLevelId`)
);

CREATE TABLE `AssignmentStudyLog`
(
    `userId` int NOT NULL,
    `assignmentId` int NOT NULL,
    `studyDate` DATE NOT NULL,
    `studyHours` DECIMAL(4,2) NOT NULL DEFAULT 0.00,

    PRIMARY KEY(`userId`,`studyDate`),
    KEY `FK_36` (`assignmentId`),
    CONSTRAINT `FK_36` FOREIGN KEY (`assignmentId`) REFERENCES `StudentAssignmentQuestion` (`assignmentId`),
    KEY `FK_37` (`userId`),
    CONSTRAINT `FK_37` FOREIGN KEY (`userId`) REFERENCES `Learner` (`userId`)
);

CREATE TABLE UserMilestone
(
    `userId` int NOT NULL,
    `milestoneId` int NOT NULL,
    `objective` int NOT NULL,
    `progress` int NOT NULL DEFAULT 0,

PRIMARY KEY(`userId`, `milestoneId`),
KEY `FK_5` (`userId`),
CONSTRAINT `FK_33_0` FOREIGN KEY `FK_5` (`userId`) REFERENCES `Learner` (`userId`),
KEY `FK_6` (`milestoneId`),
CONSTRAINT `FK_33_1` FOREIGN KEY `FK_6` (`milestoneId`) REFERENCES `Milestone` (`milestoneId`)
);


-- Trigger to check and award badge if the progress reaches the objective on UPDATE
DELIMITER // 
-- Delimiter is for specifying the end of a block of code differently than a semi-colon.
CREATE TRIGGER check_and_award_badge
AFTER UPDATE ON UserMilestone
FOR EACH ROW
BEGIN 
    DECLARE objectiveReached INT;

    -- Check if the updated progress meets or exceeds the objective
    SET objectiveReached = (SELECT CASE WHEN NEW.progress >= NEW.objective then 1 ELSE 0 END);

    IF objectiveReached = 1 THEN
        -- Check if the badge is not already awarded
        IF NOT EXISTS (SELECT 1 FROM LearnerBadges WHERE userId = NEW.userId AND badgeId = (SELECT badgeId FROM Milestone WHERE milestoneId = NEW.milestoneId)) THEN
            -- Award the badge if it doesn't yet exist in LearnerBadges
            INSERT INTO LearnerBadges(userId, badgeId) VALUES (NEW.userId, (SELECT badgeId FROM Milestone WHERE milestoneId = NEW.milestoneId));
        END IF;
    END IF;
END //
DELIMITER ;


DELIMITER //
CREATE EVENT update_module_status1
ON SCHEDULE
    EVERY 1 MINUTE -- Change this to the desired interval for checking updates
COMMENT 'Updates the status in Modules table based on Assignment table'
DO
BEGIN
    -- Step 3: Write the SQL logic to update the status in Modules table
    UPDATE gamifyDb.Module AS m
    SET m.status = 2
    WHERE m.status = 1
    AND EXISTS (
        SELECT 1
        FROM gamifyDb.Assignment AS a
        WHERE a.moduleId = m.moduleId AND a.status = 2
    );
END;
//
DELIMITER ;



DELIMITER //
CREATE EVENT update_assignment_status2
ON SCHEDULE
    EVERY 1 MINUTE-- Change this to the desired interval for checking updates
COMMENT 'Updates the status in Assignment table based on StudentAssignmentQuestion table'
DO
BEGIN
    -- Step 3: Write the SQL logic to update the status in Assignment table
    UPDATE gamifyDb.Assignment AS a
    SET a.status = 3
    WHERE a.status = 2
    AND NOT EXISTS (
        SELECT 1
        FROM gamifyDb.StudentAssignmentQuestion AS saq
        WHERE saq.assignmentId = a.assignmentId AND saq.completed = 0
    );
END;
//
DELIMITER ;


-- Trigger to delete questions that fall below the score limit of 3 user reports
DELIMITER $$
CREATE EVENT delete_low_score_question
    ON SCHEDULE EVERY 1 MINUTE
    DO
    BEGIN
        UPDATE gamifyDb.Question SET active = 0 WHERE score < 80;
    END;
$$
DELIMITER ;


DELIMITER //
CREATE EVENT update_assignment_status1
ON SCHEDULE
    EVERY 1 MINUTE -- Change this to the desired interval for checking updates
COMMENT 'Updates the status in Assignment table based on StudentAssignmentQuestion table'
DO
BEGIN
    -- Step 3: Write the SQL logic to update the status in Assignment table
    UPDATE gamifyDb.Assignment AS a
    SET a.status = 2
    WHERE a.status = 1
    AND EXISTS (
        SELECT 1
        FROM gamifyDb.StudentAssignmentQuestion AS saq
        WHERE saq.assignmentId = a.assignmentId AND NOT saq.partialAnswer = null AND saq.completed = 0
    );
END;
//
DELIMITER ;

DELIMITER //
CREATE EVENT update_module_status
ON SCHEDULE
    EVERY 1 MINUTE -- Change this to the desired interval for checking updates
COMMENT 'Updates the status in Modules table based on Assignment table'
DO
BEGIN
    -- Step 3: Write the SQL logic to update the status in Modules table
    UPDATE gamifyDb.Module AS m
    SET m.status = 3
    WHERE m.status = 2
    AND NOT EXISTS (
        SELECT 1
        FROM gamifyDb.Assignment AS a
        WHERE a.moduleId = m.moduleId AND a.status <> 3
    );
END;
//
DELIMITER ;


-- Trigger to check and award badge if the progress reaches the objective on INSERT
DELIMITER // 

CREATE TRIGGER check_and_award_badge_after_insert
AFTER INSERT ON UserMilestone
FOR EACH ROW 
BEGIN
  DECLARE objectiveReached INT;

  -- Check if the updated progress meets or exceeds the objective
    SET objectiveReached = (SELECT CASE WHEN NEW.progress >= NEW.objective then 1 ELSE 0 END);

    IF objectiveReached = 1 THEN
        -- Check if the badge is not already awarded
        IF NOT EXISTS (SELECT 1 FROM LearnerBadges WHERE userId = NEW.userId AND badgeId = (SELECT badgeId FROM Milestone WHERE milestoneId = NEW.milestoneId)) THEN
            -- Award the badge if it doesn't yet exist in LearnerBadges
            INSERT INTO LearnerBadges(userId, badgeId) VALUES (NEW.userId, (SELECT badgeId FROM Milestone WHERE milestoneId = NEW.milestoneId));
        END IF;
    END IF;
END //
DELIMITER ;

-- Trigger to increase milestone progress after INSERT in LearnerQuestions
DELIMITER // 

CREATE TRIGGER increase_progress_after_insert
AFTER INSERT ON LearnerQuestions
FOR EACH ROW
BEGIN
    IF NEW.completed = 1 THEN   
        UPDATE UserMilestone UM
        JOIN Question Q ON NEW.questionId = Q.questionId
        JOIN Milestone M ON UM.milestoneId = M.milestoneId
        JOIN QuestionPrompt QP ON Q.questionPromptId = QP.questionPromptId
        SET UM.progress = UM.progress + 1
        WHERE UM.userId = NEW.userId
        AND M.programmingLanguageId = QP.programmingLanguageId
        AND M.proficiencyLevelId = QP.proficiencyLevelId;
    END IF;
END //
DELIMITER ;


DELIMITER // 

CREATE TRIGGER increase_progress_after_insert_student
AFTER INSERT ON StudentAssignmentQuestion
FOR EACH ROW
BEGIN
    IF NEW.completed = 1 THEN   
        UPDATE UserMilestone UM
        JOIN Question Q ON NEW.questionId = Q.questionId
        JOIN Milestone M ON UM.milestoneId = M.milestoneId
        JOIN QuestionPrompt QP ON Q.questionPromptId = QP.questionPromptId
        SET UM.progress = UM.progress + 1
        WHERE UM.userId = NEW.userId
        AND M.programmingLanguageId = QP.programmingLanguageId
        AND M.proficiencyLevelId = QP.proficiencyLevelId;
    END IF;
END //
DELIMITER ;

-- Trigger to increase milestone progress after UPDATE in LearnerQuestions

DELIMITER // 

CREATE TRIGGER increase_progress_after_update
AFTER UPDATE ON LearnerQuestions
FOR EACH ROW
BEGIN
    IF NEW.completed = 1 THEN   
        UPDATE UserMilestone UM
        JOIN Question Q ON NEW.questionId = Q.questionId
        JOIN Milestone M ON UM.milestoneId = M.milestoneId
        JOIN QuestionPrompt QP ON Q.questionPromptId = QP.questionPromptId
        SET UM.progress = UM.progress + 1
        WHERE UM.userId = NEW.userId
        AND M.programmingLanguageId = QP.programmingLanguageId
        AND M.proficiencyLevelId = QP.proficiencyLevelId;
    END IF;
END //
DELIMITER ;

DELIMITER // 

CREATE TRIGGER increase_progress_after_update_student
AFTER UPDATE ON StudentAssignmentQuestion
FOR EACH ROW
BEGIN
    IF NEW.completed = 1 THEN   
        UPDATE UserMilestone UM
        JOIN Question Q ON NEW.questionId = Q.questionId
        JOIN Milestone M ON UM.milestoneId = M.milestoneId
        JOIN QuestionPrompt QP ON Q.questionPromptId = QP.questionPromptId
        SET UM.progress = UM.progress + 1
        WHERE UM.userId = NEW.userId
        AND M.programmingLanguageId = QP.programmingLanguageId
        AND M.proficiencyLevelId = QP.proficiencyLevelId;
    END IF;
END //
DELIMITER ;

-- Trigger to initialize user Milestones after creating a learner
DELIMITER // 

CREATE TRIGGER initialize_user_milestone
AFTER INSERT ON Learner
FOR EACH ROW
BEGIN
    INSERT INTO UserMilestone (userId, milestoneId, objective, progress)
        SELECT NEW.userId, milestoneId, 5, 0
        FROM Milestone;
END // 
DELIMITER ;

--  Trigger to award new users a welcome badge
DELIMITER // 

CREATE TRIGGER learner_welcome_badges
AFTER INSERT ON Learner
FOR EACH ROW
BEGIN   
    -- Insert the welcome badge (with badgeId 1) for the new learner
    INSERT INTO LearnerBadges (userId, badgeId) VALUES (NEW.userId, 1);
END //
DELIMITER ;


-- Trigger to create a notification after a learner is awarded a new badge
DELIMITER //

CREATE TRIGGER badge_notification_after_insert
AFTER INSERT ON LearnerBadges
FOR EACH ROW
BEGIN
    -- Declare a variable for the badge name
    DECLARE badge_title VARCHAR(50);

    -- Get the badge name
    SELECT title INTO badge_title FROM Badge WHERE badgeId = NEW.badgeId;

    -- Insert into Notification table
    INSERT INTO Notification (userId, content, date, status)
    VALUES (NEW.userId, CONCAT('You have received the ', badge_title, ' Badge'), NOW(), 0);

    -- Get the ID of the newly created notification
    SET @last_notification_id = LAST_INSERT_ID();

    -- Insert into BadgeNotification table
    INSERT INTO BadgeNotification (notificationId, userId, badgeId)
    VALUES (@last_notification_id, NEW.userId, NEW.badgeId);
END //
DELIMITER ;

-- programming Language inserts 

INSERT INTO ProgrammingLanguage(name, iconpath) VALUES ('Java', '/image/languageIcons/JAVA_LOGO.svg');
INSERT INTO ProgrammingLanguage(name, iconpath) VALUES ('JavaScript', '/image/languageIcons/JAVASCRIPT_LOGO.svg');
INSERT INTO ProgrammingLanguage(name, iconpath) VALUES ('Python', '/image/languageIcons/PYTHON_LOGO.svg');
INSERT INTO ProgrammingLanguage(name, iconpath) VALUES ('Rust', '/image/languageIcons/RUST_LOGO.svg');
INSERT INTO ProgrammingLanguage(name, iconpath) VALUES ('TypeScript', '/image/languageIcons/TYPESCRIPT_LOGO.svg');
INSERT INTO ProgrammingLanguage(name, iconpath) VALUES ('PHP', '/image/languageIcons/PHP_LOGO.svg');
INSERT INTO ProgrammingLanguage(name, iconpath) VALUES ('SQL', '/image/languageIcons/SQL_LOGO.svg');
INSERT INTO ProgrammingLanguage(name, iconpath) VALUES ('CSS', '/image/languageIcons/CSS_LOGO.svg');
INSERT INTO ProgrammingLanguage(name, iconpath) VALUES ('Swift', '/image/languageIcons/SWIFT_LOGO.svg');
INSERT INTO ProgrammingLanguage(name, iconpath) VALUES ('Go', '/image/languageIcons/GO_LOGO.svg');
INSERT INTO ProgrammingLanguage(name, iconpath) VALUES ('HTML', '/image/languageIcons/HTML_LOGO.svg');

-- proficiency Levels Inserts

INSERT INTO ProficiencyLevel(name) VALUES ('Beginner');
INSERT INTO ProficiencyLevel(name) VALUES ('Intermediate');
INSERT INTO ProficiencyLevel(name) VALUES ('Expert');

-- Badge INSERTS

-- welcome Badge, id would be 1 
INSERT INTO Badge(name, threshold, title, iconpath, proficiencyLevelId) VALUES ('Welcome Badge', 0, 'Newcomer', '/image/beginner/NEWBIE1.svg', 1);
INSERT INTO Badge(name, threshold, title, iconpath, proficiencyLevelId) VALUES ('Test Badge', 0, 'Tester', '/image/beginner/NEWBIE1.svg', 1);

INSERT INTO Badge(name, title, threshold, iconpath, proficiencyLevelId) VALUES ('Java1', 'Java Beginner', 5, '/image/beginner/Java1.svg', 1);
INSERT INTO Badge(name, title, threshold, iconpath, proficiencyLevelId) VALUES ('CSS1', 'CSS Beginner', 5, '/image/beginner/CSS1.svg', 1);
INSERT INTO Badge(name, title, threshold, iconpath, proficiencyLevelId) VALUES ('GO1', 'GO Beginner', 5, '/image/beginner/Go1.svg', 1);
INSERT INTO Badge(name, title, threshold, iconpath, proficiencyLevelId) VALUES ('HTML1', 'HTML Beginner', 5, '/image/beginner/HTML1.svg', 1);
INSERT INTO Badge(name, title, threshold, iconpath, proficiencyLevelId) VALUES ('JavaScript1', 'JavaScript Beginner', 5, '/image/beginner/JS1.svg', 1);
INSERT INTO Badge(name, title, threshold, iconpath, proficiencyLevelId) VALUES ('PHP1', 'PHP Beginner', 5, '/image/beginner/PHP1.svg', 1);
INSERT INTO Badge(name, title, threshold, iconpath, proficiencyLevelId) VALUES ('Python1', 'Python Beginner', 5, '/image/beginner/Python1.svg', 1);
INSERT INTO Badge(name, title, threshold, iconpath, proficiencyLevelId) VALUES ('Rust1', 'Rust Beginner', 5, '/image/beginner/Rust1.svg', 1);
INSERT INTO Badge(name, title, threshold, iconpath, proficiencyLevelId) VALUES ('SQL1', 'SQL Beginner', 5, '/image/beginner/SQL1.svg', 1);
INSERT INTO Badge(name, title, threshold, iconpath, proficiencyLevelId) VALUES ('Swift1', 'Swift Beginner', 5, '/image/beginner/Swift1.svg', 1);
INSERT INTO Badge(name, title, threshold, iconpath, proficiencyLevelId) VALUES ('TypeScript1', 'TypeScript Beginner', 5, '/image/beginner/TypeScript1.svg', 1);

INSERT INTO Badge(name, title, threshold, iconpath, proficiencyLevelId) VALUES ('Java2', 'Java Intermediate', 5, '/image/intermediate/Java2.svg', 2);
INSERT INTO Badge(name, title, threshold, iconpath, proficiencyLevelId) VALUES ('CSS2', 'CSS Intermediate', 5, '/image/intermediate/CSS2.svg', 2);
INSERT INTO Badge(name, title, threshold, iconpath, proficiencyLevelId) VALUES ('GO2', 'GO Intermediate', 5, '/image/intermediate/Go2.svg', 2);
INSERT INTO Badge(name, title, threshold, iconpath, proficiencyLevelId) VALUES ('HTML2', 'HTML Intermediate', 5, '/image/intermediate/HTML2.svg', 2);
INSERT INTO Badge(name, title, threshold, iconpath, proficiencyLevelId) VALUES ('JavaScript2', 'JavaScript Intermediate', 5, '/image/intermediate/JS2.svg', 2);
INSERT INTO Badge(name, title, threshold, iconpath, proficiencyLevelId) VALUES ('PHP2', 'PHP Intermediate', 5, '/image/intermediate/PHP2.svg', 2);
INSERT INTO Badge(name, title, threshold, iconpath, proficiencyLevelId) VALUES ('Python2', 'Python Intermediate', 5, '/image/intermediate/Python2.svg', 2);
INSERT INTO Badge(name, title, threshold, iconpath, proficiencyLevelId) VALUES ('Rust2', 'Rust Intermediate', 5, '/image/intermediate/Rust2.svg', 2);
INSERT INTO Badge(name, title, threshold, iconpath, proficiencyLevelId) VALUES ('SQL2', 'SQL Intermediate', 5, '/image/intermediate/SQL2.svg', 2);
INSERT INTO Badge(name, title, threshold, iconpath, proficiencyLevelId) VALUES ('Swift2', 'Swift Intermediate', 5, '/image/intermediate/Swift2.svg', 2);
INSERT INTO Badge(name, title, threshold, iconpath, proficiencyLevelId) VALUES ('TypeScript2', 'TypeScript Intermediate', 5, '/image/intermediate/TypeScript2.svg', 2);


INSERT INTO Badge(name, title, threshold, iconpath, proficiencyLevelId) VALUES ('Java3', 'Java Expert', 5, '/image/expert/Java3.svg', 3);
INSERT INTO Badge(name, title, threshold, iconpath, proficiencyLevelId) VALUES ('CSS3', 'CSS Expert', 5, '/image/expert/CSS3.svg', 3);
INSERT INTO Badge(name, title, threshold, iconpath, proficiencyLevelId) VALUES ('GO3', 'GO Expert', 5, '/image/expert/Go3.svg', 3);
INSERT INTO Badge(name, title, threshold, iconpath, proficiencyLevelId) VALUES ('HTML3', 'HTML Expert', 5, '/image/expert/HTML3.svg', 3);
INSERT INTO Badge(name, title, threshold, iconpath, proficiencyLevelId) VALUES ('JavaScript3', 'JavaScript Expert', 5, '/image/expert/JS3.svg', 3);
INSERT INTO Badge(name, title, threshold, iconpath, proficiencyLevelId) VALUES ('PHP3', 'PHP Expert', 5, '/image/expert/PHP3.svg', 3);
INSERT INTO Badge(name, title, threshold, iconpath, proficiencyLevelId) VALUES ('Python3', 'Python Expert', 5, '/image/expert/Python3.svg', 3);
INSERT INTO Badge(name, title, threshold, iconpath, proficiencyLevelId) VALUES ('Rust3', 'Rust Expert', 5, '/image/expert/Rust3.svg', 3);
INSERT INTO Badge(name, title, threshold, iconpath, proficiencyLevelId) VALUES ('SQL3', 'SQL Expert', 5, '/image/expert/SQL3.svg', 3);
INSERT INTO Badge(name, title, threshold, iconpath, proficiencyLevelId) VALUES ('Swift3', 'Swift Expert', 5, '/image/expert/Swift3.svg', 3);
INSERT INTO Badge(name, title, threshold, iconpath, proficiencyLevelId) VALUES ('TypeScript3', 'TypeScript Expert', 5, '/image/expert/TypeScript3.svg', 3);




-- Milestone INSERTS
-- Beginner Milestones
INSERT INTO Milestone(badgeId, programmingLanguageId, proficiencyLevelId, imagePath)
VALUES ((SELECT badgeId FROM Badge WHERE name='Java1'), 1, 1, '/image/languageIcons/JAVA_LOGO.svg');

INSERT INTO Milestone(badgeId, programmingLanguageId, proficiencyLevelId, imagePath)
VALUES ((SELECT badgeId FROM Badge WHERE name='CSS1'), 8, 1, '/image/languageIcons/CSS_LOGO.svg');

INSERT INTO Milestone(badgeId, programmingLanguageId, proficiencyLevelId, imagePath)
VALUES ((SELECT badgeId FROM Badge WHERE name='GO1'), 10, 1, '/image/languageIcons/GO_LOGO.svg');

INSERT INTO Milestone(badgeId, programmingLanguageId, proficiencyLevelId, imagePath)
VALUES ((SELECT badgeId FROM Badge WHERE name='HTML1'), 11, 1, '/image/languageIcons/HTML_LOGO.svg');

INSERT INTO Milestone(badgeId, programmingLanguageId, proficiencyLevelId, imagePath)
VALUES ((SELECT badgeId FROM Badge WHERE name='JavaScript1'), 2, 1, '/image/languageIcons/JAVASCRIPT_LOGO.svg');

INSERT INTO Milestone(badgeId, programmingLanguageId, proficiencyLevelId, imagePath)
VALUES ((SELECT badgeId FROM Badge WHERE name='PHP1'), 6, 1, '/image/languageIcons/PHP_LOGO.svg');

INSERT INTO Milestone(badgeId, programmingLanguageId, proficiencyLevelId, imagePath)
VALUES ((SELECT badgeId FROM Badge WHERE name='Python1'), 3, 1, '/image/languageIcons/PYTHON_LOGO.svg');

INSERT INTO Milestone(badgeId, programmingLanguageId, proficiencyLevelId, imagePath)
VALUES ((SELECT badgeId FROM Badge WHERE name='Rust1'), 4, 1, '/image/languageIcons/RUST_LOGO.svg');

INSERT INTO Milestone(badgeId, programmingLanguageId, proficiencyLevelId, imagePath)
VALUES ((SELECT badgeId FROM Badge WHERE name='SQL1'), 7, 1, '/image/languageIcons/SQL_LOGO.svg');

INSERT INTO Milestone(badgeId, programmingLanguageId, proficiencyLevelId, imagePath)
VALUES ((SELECT badgeId FROM Badge WHERE name='Swift1'), 9, 1, '/image/languageIcons/SWIFT_LOGO.svg');

INSERT INTO Milestone(badgeId, programmingLanguageId, proficiencyLevelId, imagePath)
VALUES ((SELECT badgeId FROM Badge WHERE name='TypeScript1'), 5, 1, '/image/languageIcons/TYPESCRIPT_LOGO.svg');

-- Intermediate Milestones
INSERT INTO Milestone(badgeId, programmingLanguageId, proficiencyLevelId, imagePath)
VALUES ((SELECT badgeId FROM Badge WHERE name='Java2'), 1, 2, '/image/languageIcons/JAVA_LOGO.svg');

INSERT INTO Milestone(badgeId, programmingLanguageId, proficiencyLevelId, imagePath)
VALUES ((SELECT badgeId FROM Badge WHERE name='CSS2'), 8, 2, '/image/languageIcons/CSS_LOGO.svg');

INSERT INTO Milestone(badgeId, programmingLanguageId, proficiencyLevelId, imagePath)
VALUES ((SELECT badgeId FROM Badge WHERE name='GO2'), 10, 2, '/image/languageIcons/GO_LOGO.svg');

INSERT INTO Milestone(badgeId, programmingLanguageId, proficiencyLevelId, imagePath)
VALUES ((SELECT badgeId FROM Badge WHERE name='HTML2'), 11, 2, '/image/languageIcons/HTML_LOGO.svg');

INSERT INTO Milestone(badgeId, programmingLanguageId, proficiencyLevelId, imagePath)
VALUES ((SELECT badgeId FROM Badge WHERE name='JavaScript2'), 2, 2, '/image/languageIcons/beginner/JAVASCRIPT_LOGO.svg');

INSERT INTO Milestone(badgeId, programmingLanguageId, proficiencyLevelId, imagePath)
VALUES ((SELECT badgeId FROM Badge WHERE name='PHP2'), 6, 2, '/image/languageIcons/PHP_LOGO.svg');

INSERT INTO Milestone(badgeId, programmingLanguageId, proficiencyLevelId, imagePath)
VALUES ((SELECT badgeId FROM Badge WHERE name='Python2'), 3, 2, '/image/languageIcons/PYTHON_LOGO.svg');

INSERT INTO Milestone(badgeId, programmingLanguageId, proficiencyLevelId, imagePath)
VALUES ((SELECT badgeId FROM Badge WHERE name='Rust2'), 4, 2, '/image/languageIcons/RUST_LOGO.svg');

INSERT INTO Milestone(badgeId, programmingLanguageId, proficiencyLevelId, imagePath)
VALUES ((SELECT badgeId FROM Badge WHERE name='SQL2'), 7, 2, '/image/languageIcons/SQL_LOGO.svg');

INSERT INTO Milestone(badgeId, programmingLanguageId, proficiencyLevelId, imagePath)
VALUES ((SELECT badgeId FROM Badge WHERE name='Swift2'), 9, 2, '/image/languageIcons/SWIFT_LOGO.svg');

INSERT INTO Milestone(badgeId, programmingLanguageId, proficiencyLevelId, imagePath)
VALUES ((SELECT badgeId FROM Badge WHERE name='TypeScript2'), 5, 2, '/image/languageIcons/TYPESCRIPT_LOGO.svg');

-- Expert Milestones
INSERT INTO Milestone(badgeId, programmingLanguageId, proficiencyLevelId, imagePath)
VALUES ((SELECT badgeId FROM Badge WHERE name='Java3'), 1, 3, '/image/languageIcons/JAVA_LOGO.svg');

INSERT INTO Milestone(badgeId, programmingLanguageId, proficiencyLevelId, imagePath)
VALUES ((SELECT badgeId FROM Badge WHERE name='CSS3'), 8, 3, '/image/languageIcons/CSS_LOGO.svg');

INSERT INTO Milestone(badgeId, programmingLanguageId, proficiencyLevelId, imagePath)
VALUES ((SELECT badgeId FROM Badge WHERE name='GO3'), 10, 3, '/image/languageIcons/GO_LOGO.svg');

INSERT INTO Milestone(badgeId, programmingLanguageId, proficiencyLevelId, imagePath)
VALUES ((SELECT badgeId FROM Badge WHERE name='HTML3'), 11, 3, '/image/languageIcons/HTML_LOGO.svg');

INSERT INTO Milestone(badgeId, programmingLanguageId, proficiencyLevelId, imagePath)
VALUES ((SELECT badgeId FROM Badge WHERE name='JavaScript3'), 2, 3, '/image/languageIcons/beginner/JAVASCRIPT_LOGO.svg');

INSERT INTO Milestone(badgeId, programmingLanguageId, proficiencyLevelId, imagePath)
VALUES ((SELECT badgeId FROM Badge WHERE name='PHP3'), 6, 3, '/image/languageIcons/PHP_LOGO.svg');

INSERT INTO Milestone(badgeId, programmingLanguageId, proficiencyLevelId, imagePath)
VALUES ((SELECT badgeId FROM Badge WHERE name='Python3'), 3, 3, '/image/languageIcons/PYTHON_LOGO.svg');

INSERT INTO Milestone(badgeId, programmingLanguageId, proficiencyLevelId, imagePath)
VALUES ((SELECT badgeId FROM Badge WHERE name='Rust3'), 4, 3, '/image/languageIcons/RUST_LOGO.svg');

INSERT INTO Milestone(badgeId, programmingLanguageId, proficiencyLevelId, imagePath)
VALUES ((SELECT badgeId FROM Badge WHERE name='SQL3'), 7, 3, '/image/languageIcons/SQL_LOGO.svg');

INSERT INTO Milestone(badgeId, programmingLanguageId, proficiencyLevelId, imagePath)
VALUES ((SELECT badgeId FROM Badge WHERE name='Swift3'), 9, 3, '/image/languageIcons/SWIFT_LOGO.svg');

INSERT INTO Milestone(badgeId, programmingLanguageId, proficiencyLevelId, imagePath)
VALUES ((SELECT badgeId FROM Badge WHERE name='TypeScript3'), 5, 3, '/image/languageIcons/TYPESCRIPT_LOGO.svg');

-- INSERT statements
INSERT INTO UserRole (name) VALUES ('freeLearner'); 
-- user ID will be 1
INSERT INTO UserRole (name) VALUES ('student');
-- user ID will be 2
INSERT INTO UserRole (name) VALUES ('instructor');
-- user ID will be 3
INSERT INTO UserRole (name) VALUES ('admin');
-- user ID will be 4



-- Learner mock user, password is mockPass
INSERT INTO Users (username, firstName, lastName, email, password, userRoleId) VALUES ('mocklearner', 'Mock', 'Learner', 'mocklearner@gmail.com', '$2b$12$FV6CfOWLmZa46qrNzYiE6OYlGNJxy/d2jPaRY1B.RbwsWdH7eoR4W', 1);


SET @last_id_in_users = LAST_INSERT_ID();
-- In our signup, any new user that is a learner will have a learner table created as well
INSERT INTO Learner(userId, selectedBadgeTitleId) VALUES (@last_id_in_users, 1);

-- Mock institution
INSERT INTO Institution(name, institutionCode) VALUES('Mock Academy', 'MOCK100');

SET @mock_institution_id = LAST_INSERT_ID();
-- Mock Instructor password is instructor
INSERT INTO Users (username, firstName, lastName, email, password, userRoleId) VALUES('mockinstructor', 'Mock', 'Instructor', 'mockinstructor@gmail.com', '$2b$12$FV6CfOWLmZa46qrNzYiE6OYlGNJxy/d2jPaRY1B.RbwsWdH7eoR4W', 3);

SET @mock_instructor_id = LAST_INSERT_ID();
INSERT INTO Instructor (userId, institutionId) VALUES (@mock_instructor_id, @mock_institution_id);
-- Mock Class, classId will be 499
INSERT INTO Class (name, joinCode, description, userId) VALUES ('Mock Class 499', 'MOCK499','A mock class to help us understand the system for MVP!', @mock_instructor_id);
SET @mock_class_id1 = LAST_INSERT_ID();
INSERT INTO Class (name, joinCode, description, userId) VALUES ('Mock Class 211', 'MOCK211', 'Another mock class to help us understand the system for MVP!', @mock_instructor_id);
SET @mock_class_id2 = LAST_INSERT_ID();
INSERT INTO Class (name, joinCode, description, userId) VALUES('Mock Class 213', 'MOCK213', 'Mock Class to test responsiveness', @mock_instructor_id);
INSERT INTO Class (name, joinCode, description, userId) VALUES('Mock Class 329', 'MOCK329', 'Another Mock Class to test responsiveness', @mock_instructor_id);
-- User ID 1 inserted into class Mock Class 499
INSERT INTO ClassStudent (userId, classId) VALUES (@last_id_in_users, @mock_class_id1);
INSERT INTO ClassStudent (userId, classId) VALUES(@last_id_in_users, @mock_class_id2);

INSERT INTO Module (classId, name) VALUES(1, "Intro to Javascript");

INSERT INTO Module (classId, name) VALUES(2, "Intro to Python");

-- DUMMY DATA



INSERT INTO Topic(name) VALUES ('Arrays');
INSERT INTO Topic(name) VALUES ('Hashing');
INSERT INTO Topic(name) VALUES ('Two Pointers');
INSERT INTO Topic(name) VALUES ('Binary Search');
INSERT INTO Topic(name) VALUES ('Slinding Window');
INSERT INTO Topic(name) VALUES ('Stack');
INSERT INTO Topic(name) VALUES ('Linked List');
INSERT INTO Topic(name) VALUES ('Trees');
INSERT INTO Topic(name) VALUES ('Heap');
INSERT INTO Topic(name) VALUES ('Priority Queue');
INSERT INTO Topic(name) VALUES ('Slinding Window');
INSERT INTO Topic(name) VALUES ('Backtracking');
INSERT INTO Topic(name) VALUES ('Graphs');
INSERT INTO Topic(name) VALUES ('Dynamic Programming');
INSERT INTO Topic(name) VALUES ('Greedy');
INSERT INTO Topic(name) VALUES ('Intervals');
INSERT INTO Topic(name) VALUES ('Bit Manipulation');
INSERT INTO Topic(name) VALUES ('Data Structures');
INSERT INTO Topic(name) VALUES ('Object-Oriented Design');
INSERT INTO Topic(name) VALUES ('Functional Programming');
INSERT INTO Topic(name) VALUES ('Databases');


INSERT INTO Topic(name) VALUES ('Relational Keys');
INSERT INTO Topic(name) VALUES ('Select Queries');
INSERT INTO Topic(name) VALUES ('Joins');
INSERT INTO Topic(name) VALUES ('Data Modelling');
INSERT INTO Topic(name) VALUES ('Data Definition Language');
INSERT INTO Topic(name) VALUES ('Triggers');
INSERT INTO Topic(name) VALUES ('Views');
INSERT INTO Topic(name) VALUES ('Subqueries');
INSERT INTO Topic(name) VALUES ('Temporary Tables');

INSERT INTO Topic(name) VALUES ('Color');
INSERT INTO Topic(name) VALUES ('Border');
INSERT INTO Topic(name) VALUES ('CSS box model');
INSERT INTO Topic(name) VALUES ('CSS grid layout');
INSERT INTO Topic(name) VALUES ('Fonts');
INSERT INTO Topic(name) VALUES ('Box-sizing');
INSERT INTO Topic(name) VALUES ('Text-align'); 
INSERT INTO Topic(name) VALUES ('Background');


INSERT INTO Topic(name) VALUES ('Elements');
INSERT INTO Topic(name) VALUES ('Links');
INSERT INTO Topic(name) VALUES ('Headings');
INSERT INTO Topic(name) VALUES ('Paragraphs');
INSERT INTO Topic(name) VALUES ('Formatting');
INSERT INTO Topic(name) VALUES ('Colors');
INSERT INTO Topic(name) VALUES ('Images');
INSERT INTO Topic(name) VALUES ('Lists');
INSERT INTO Topic(name) VALUES ('Tables');


INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (7, 22);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (7, 23);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (7, 24);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (7, 25);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (7, 26);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (7, 27);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (7, 28);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (7, 29);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (7, 30);


INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (8, 31);

INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (8, 32);

INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (8, 33);

INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (8, 34);

INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (8, 35);

INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (8, 36);

INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (8, 37);

INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (8, 38);


INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (11, 39);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (11, 40);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (11, 41);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (11, 42);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (11, 43);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (11, 44);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (11, 45);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (11, 46);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (11, 47);

INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (1, 1);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (1, 2);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (1, 3);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (1, 4);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (1, 5);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (1, 6);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (1, 7);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (1, 8);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (1, 9);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (1, 10);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (1, 11);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (1, 12);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (1, 13);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (1, 14);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (1, 15);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (1, 16);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (1, 17);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (1, 18);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (1, 19);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (1, 20);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (1, 21);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (2, 1);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (2, 2);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (2, 3);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (2, 4);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (2, 5);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (2, 6);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (2, 7);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (2, 8);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (2, 9);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (2, 10);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (2, 11);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (2, 12);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (2, 13);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (2, 14);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (2, 15);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (2, 16);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (2, 17);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (2, 18);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (2, 19);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (2, 20);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (2, 21);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (3, 1);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (3, 2);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (3, 3);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (3, 4);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (3, 5);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (3, 6);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (3, 7);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (3, 8);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (3, 9);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (3, 10);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (3, 11);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (3, 12);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (3, 13);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (3, 14);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (3, 15);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (3, 16);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (3, 17);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (3, 18);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (3, 19);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (3, 20);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (3, 21);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (4, 1);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (4, 2);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (4, 3);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (4, 4);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (4, 5);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (4, 6);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (4, 7);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (4, 8);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (4, 9);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (4, 10);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (4, 11);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (4, 12);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (4, 13);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (4, 14);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (4, 15);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (4, 16);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (4, 17);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (4, 18);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (4, 19);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (4, 20);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (4, 21);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (5, 1);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (5, 2);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (5, 3);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (5, 4);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (5, 5);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (5, 6);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (5, 7);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (5, 8);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (5, 9);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (5, 10);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (5, 11);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (5, 12);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (5, 13);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (5, 14);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (5, 15);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (5, 16);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (5, 17);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (5, 18);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (5, 19);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (5, 20);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (5, 21);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (6, 1);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (6, 2);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (6, 3);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (6, 4);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (6, 5);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (6, 6);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (6, 7);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (6, 8);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (6, 9);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (6, 10);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (6, 11);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (6, 12);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (6, 13);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (6, 14);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (6, 15);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (6, 16);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (6, 17);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (6, 18);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (6, 19);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (6, 20);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (6, 21);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (9, 1);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (9, 2);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (9, 3);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (9, 4);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (9, 5);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (9, 6);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (9, 7);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (9, 8);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (9, 9);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (9, 10);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (9, 11);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (9, 12);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (9, 13);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (9, 14);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (9, 15);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (9, 16);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (9, 17);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (9, 18);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (9, 19);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (9, 20);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (9, 21);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (10, 1);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (10, 2);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (10, 3);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (10, 4);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (10, 5);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (10, 6);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (10, 7);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (10, 8);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (10, 9);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (10, 10);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (10, 11);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (10, 12);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (10, 13);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (10, 14);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (10, 15);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (10, 16);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (10, 17);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (10, 18);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (10, 19);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (10, 20);
INSERT INTO TopicProgrammingLanguage(programmingLanguageId, topicId) VALUES (10, 21);


INSERT INTO QuestionPrompt(topicId, programmingLanguageId, proficiencyLevelId) VALUES (1, 1, 1);
INSERT INTO QuestionPrompt(topicId, programmingLanguageId, proficiencyLevelId) VALUES (1, 1, 2);
INSERT INTO QuestionPrompt(topicId, programmingLanguageId, proficiencyLevelId) VALUES (1, 1, 3);
INSERT INTO QuestionPrompt(topicId, programmingLanguageId, proficiencyLevelId) VALUES (2, 1, 1);
INSERT INTO QuestionPrompt(topicId, programmingLanguageId, proficiencyLevelId) VALUES (2, 1, 2);
INSERT INTO QuestionPrompt(topicId, programmingLanguageId, proficiencyLevelId) VALUES (2, 1, 3);
INSERT INTO QuestionPrompt(topicId, programmingLanguageId, proficiencyLevelId) VALUES (3, 2, 1);
INSERT INTO QuestionPrompt(topicId, programmingLanguageId, proficiencyLevelId) VALUES (3, 2, 2);
INSERT INTO QuestionPrompt(topicId, programmingLanguageId, proficiencyLevelId) VALUES (3, 2, 3);
INSERT INTO QuestionPrompt(topicId, programmingLanguageId, proficiencyLevelId) VALUES (4, 3, 1);
INSERT INTO QuestionPrompt(topicId, programmingLanguageId, proficiencyLevelId) VALUES (4, 3, 2);
INSERT INTO QuestionPrompt(topicId, programmingLanguageId, proficiencyLevelId) VALUES (4, 3, 3);
INSERT INTO QuestionPrompt(topicId, programmingLanguageId, proficiencyLevelId) VALUES (5, 3, 1);
INSERT INTO QuestionPrompt(topicId, programmingLanguageId, proficiencyLevelId) VALUES (5, 3, 2);
INSERT INTO QuestionPrompt(topicId, programmingLanguageId, proficiencyLevelId) VALUES (5, 3, 3);
INSERT INTO QuestionPrompt(topicId, programmingLanguageId, proficiencyLevelId) VALUES (6, 2, 1);
INSERT INTO QuestionPrompt(topicId, programmingLanguageId, proficiencyLevelId) VALUES (6, 2, 2);
INSERT INTO QuestionPrompt(topicId, programmingLanguageId, proficiencyLevelId) VALUES (6, 2, 3);
INSERT INTO QuestionPrompt(topicId, programmingLanguageId, proficiencyLevelId) VALUES (7, 2, 1);
INSERT INTO QuestionPrompt(topicId, programmingLanguageId, proficiencyLevelId) VALUES (7, 2, 2);
INSERT INTO QuestionPrompt(topicId, programmingLanguageId, proficiencyLevelId) VALUES (7, 2, 3);
INSERT INTO QuestionPrompt(topicId, programmingLanguageId, proficiencyLevelId) VALUES (8, 4, 1);
INSERT INTO QuestionPrompt(topicId, programmingLanguageId, proficiencyLevelId) VALUES (8, 4, 2);
INSERT INTO QuestionPrompt(topicId, programmingLanguageId, proficiencyLevelId) VALUES (8, 4, 3);
INSERT INTO QuestionPrompt(topicId, programmingLanguageId, proficiencyLevelId) VALUES (9, 4, 1);
INSERT INTO QuestionPrompt(topicId, programmingLanguageId, proficiencyLevelId) VALUES (9, 4, 2);
INSERT INTO QuestionPrompt(topicId, programmingLanguageId, proficiencyLevelId) VALUES (9, 4, 3);
INSERT INTO QuestionPrompt(topicId, programmingLanguageId, proficiencyLevelId) VALUES (18, 2, 1);




INSERT INTO Question(textContent, questionPromptId, score) VALUES ("Question:\n Find the Largest Number in an Array.\n\n Instructions (Java):\n Write a Java program that finds the largest number in an array. The program should take an array as input from the user. It should print the largest number in the array to the console.\n\n Get Coding Geek!", 1, 100);
INSERT INTO Question(textContent, questionPromptId, score) VALUES ("Question:\n What is the most efficient way to find the sum of two arrays, using Java?\n\n Instructions:\n Given two integer arrays of equal length in Java, write a function to get the sum of all its elements. In other words, create a function that adds all elements of both the arrays and returns the sum.\n\n Get Coding Geek!", 2, 100);
INSERT INTO Question(textContent, questionPromptId, score) VALUES ("Question:\n What is the most efficient way to search for an element in an unsorted array using Java?\n\n Instructions:\n Using the Java programming language, write a function which takes an array and a keyword as an argument and searches the array for the keyword. If found, the index of the keyword is returned, otherwise -1 is returned.\n\n Get Coding Geek!", 3, 100);
INSERT INTO Question(textContent, questionPromptId, score) VALUES ("Question:\n Given an array of integers, return an array of those same integers hashed using the MD5 algorithm.\n\n Instructions:\n Write a Java program that takes in an integer array and returns an array of the same integers hashed using the MD5 algorithm. Use the provided main method as the starting point for your code and ensure that your output matches the provided example output.\n\n Get Coding Geek!", 4, 100);
INSERT INTO Question(textContent, questionPromptId, score) VALUES ("Question:\n Given a string, print its hash value using Java's SHA-256 hashing algorithm.\n\n Question:\n What is the hash value of a given string, using Java's SHA-256 hashing algorithm?\n\n Instructions:\n Using Java, write a program that takes in a String as input and prints out its hash value using SHA-256 hashing algorithm.\n\n Get Coding Geek!", 5, 100);
INSERT INTO Question(textContent, questionPromptId, score) VALUES ("Question:\n What is an algorithm to generate a hash in Java?\n\n Instructions:\n Create an algorithm in Java to generate a hash based on the given input string. The generated hash must be unique for each input string.\n\n Get Coding Geek!", 6, 100);

INSERT INTO Question(textContent, questionPromptId, score) VALUES ("Question:\n Given an array of integers, how can you determine if the array contains any duplicate values using the two pointer technique?\n\n Instructions:\n Use Javascript to write a function that loops through the array given and uses two pointers to look for duplicate values. The function should return a boolean value representing if a duplicate value is found.\n\n Get Coding Geek!", 7, 100);
INSERT INTO Question(textContent, questionPromptId, score) VALUES ("Question:\n Given an integer array, find two elements such that their sum is equal to a target value?\n\n Instructions:\n Using Javascript, create a function to return an array of two elements from a given array that sum to the target value. The array should not contain duplicate elements.\n\n Get Coding Geek!", 8, 100);
INSERT INTO Question(textContent, questionPromptId, score) VALUES ("Question:\n Given two sorted integer arrays nums1 and nums2, merge nums2 into nums1 as one sorted array.\n\n Instructions:\n Write a Javascript function that takes two sorted integer arrays, nums1 and nums2, and merge them into nums1 as one sorted array. Array arguments may have a different length. Do this using the two-pointers approach and return the modified nums1. Array nums1 has enough space to accommodate the nums2 elements.\n Get Coding Geek!", 9, 100);

INSERT INTO Question(textContent, questionPromptId, score) VALUES ("Question:\n Binary Search in Python.\n\n Instructions:\n Write a function that uses binary search to determine if a value exists within an ordered array. The function should take two arguments - an array and a search value. It should return True if the search value exists within the array, or False if it does not. Use Python as the language for this challenge.\n Get Coding Geek!", 10, 100);
INSERT INTO Question(textContent, questionPromptId, score) VALUES ("Question:\n Write a function to implement Binary Search. The function should take two parameters, an array of integers and a number to find in the array.\n\n Instructions:\n The function should iterate through the array and check if the number is present in the array. If it is present, the function should return the index of the number, otherwise, it should return -1. Please consider the efficiency of your code before submitting your answer.\n Get Coding Geek!", 11, 100);
INSERT INTO Question(textContent, questionPromptId, score) VALUES ("Question:\n How do you use a Binary Search to find a number in a sorted list?\n\n Instructions:\n Given a sorted list of numbers, write a program in Python that uses a Binary Search algorithm to find a number in the list. Your program must accept the list of numbers from the user, and the number to be found as command line arguments. The output should be the index of the number found in the list. Additionally, the program must also provide an output if it doesn’t find the number in the list.\n Get Coding Geek!", 12, 100);

INSERT INTO Question(textContent, questionPromptId, score) VALUES ("Question:\n Implement a Sliding Window Algorithm to solve the following problem:\n\n Instructions:\n In Python, write a function that takes two strings - s1 and s2 - as input. The output should be an integer that represents the length of the longest substring of s1 that occurs in s2. For example: s1 = 'geekz', s2 = 'craftgeekmax'. The longest substring of s1 which occurs in s2 is 'geek'. The length of this substring is 4 and should be outputted as 4.\n Get Coding Geek!", 13, 100);
INSERT INTO Question(textContent, questionPromptId, score) VALUES ("Question:\n Given an array of integers and an integer k, find out the maximum sum of a subarray of size k.\n\n Instructions:\n Write a function in Python that takes in an array of integers and an integer k and returns the maximum sum of a subarray of size k. To solve this problem you should use a Sliding Window technique. The Sliding Window technique allows you to reduce the time complexity of your solution from O(N^2) to O(N). Your function should return a single integer - the maximum sum of the subarray. You can assume the array contains only positive integers.\n Get Coding Geek!", 14, 100);
INSERT INTO Question(textContent, questionPromptId, score) VALUES ("Question:\n Given an array of n distinct integers and an integer k, calculate the maximum possible sum of k consecutive integers in this array.\n\n Instructions:\n You are provided with an array of distinct integers and an integer k. Write a Python program that computes the maximum possible sum of k consecutive integers in this array. Your program should have one parameter: an array of distinct integers and one integer k. Your program should output one integer - the maximum possible sum.\n Get Coding Geek!", 15, 100);

INSERT INTO Question(textContent, questionPromptId, score) VALUES ("Question:\n Create a stack data structure using JavaScript.\n\n Instructions:\n Using JavaScript, create a stack data structure with push and pop methods. Push should add an item to the top of the stack and pop should remove an item from the top of the stack. The pushed item should also be returned when the pop method is called.\n Good luck! Get Coding Geek", 16, 100);
INSERT INTO Question(textContent, questionPromptId, score) VALUES ("Question:\n Implement a Stack class from scratch in JavaScript.\n\n Instructions:\n Create a `Stack` class that contains the main stack operations, namely `push`, `pop`, and `isEmpty`. `push` - add an element to the stack, `pop` - remove an element from the stack and return it,`isEmpty` - check if the stack is empty. Your `Stack` class should be able to accept Strings, Integers, and other Objects. The code should be written in JavaScript. \nGet Coding Geek!", 17, 100);
INSERT INTO Question(textContent, questionPromptId, score) VALUES ("Question:\n What are the steps for implementing a Stack Object in JavaScript?\n\n Instructions:\n Given an array, implement a Stack data structure in JavaScript. The Stack Object should include the following methods: -push -pop -peek -isEmpty. Use the following array as the initial container: let container = []. Be sure to provide the syntax needed to implement a Stack data structure and all of the methods specified above.\n Get Coding Geek!", 18, 100);

INSERT INTO Question(textContent, questionPromptId, score) VALUES ("Question:\n Write a function that takes a linked list as an argument and returns the value of the node at the middle point of the linked list.\n\n Instructions:\n Write a function using JavaScript that takes a linked list as an argument and returns the value of the node at the middle point of the linked list. Keep in mind that the linked list may have an even or odd number of nodes. Be sure to test your code to ensure that it returns the correct output.\n Get Coding Geek!", 19, 100);

INSERT INTO Question(textContent, questionPromptId, score) VALUES ("Question:\n Given the head of a singly linked list, reverse the order of the nodes in the list in place.\n\n Instructions:\n This coding challenge is written in JavaScript. Your answer should include a function that takes in the head of a singly linked list and reverses it in place. Return the head of the reversed list. Your answer should be formatted as a JavaScript function that takes in the head of a singly linked list as an argument and returns the head of the reversed list. Make sure to completely reverse the list in place; do not create a new list.\n Get Coding Geek!", 20, 100);
INSERT INTO Question(textContent, questionPromptId, score) VALUES ("Question:\n Construct a function that takes in a Linked List and checks if it is a palindrome.\n\n Instructions:\n Using JavaScript, create a function that takes in a singly Linked List as an argument and checks whether it is a palindrome. The function should proceed to iterate through the Linked List and should return a boolean value. For example, if the argument passed is [1, 2, 3, 2, 1], then the function should return `true` since the list is a palindrome. The function should be optimized for time complexity.\n Get Coding Geek!", 21, 100);

INSERT INTO Question(textContent, questionPromptId, score) VALUES ("Question:\n Create a Binary Search Tree.\n\n Instructions:\n Using Rust, create a program that will generate a binary search tree. A binary search tree is a type of tree with nodes that contain elements, where the root node contains the greatest element and each of its children nodes contain elements that are either greater or less than its parent node. To create the binary search tree, create a Tree Node class and a BinarySearchTree class. The Tree Node class should contain the following methods: {insert, remove, search}. The BinarySearchTree class should contain the following methods: {preOrder, inOrder, postOrder}. Test your program by printing out the tree using the preOrder, inOrder, and postOrder methods.\n Get Coding Geek!", 22, 100);
INSERT INTO Question(textContent, questionPromptId, score) VALUES ("Question:\n Find the deepest node in a Binary Tree.\n\n Instructions:\n Create a function that takes in a binary tree and returns the deepest node in the tree. Use Rust to implement your solution. Get Coding Geek!", 23, 100);
INSERT INTO Question(textContent, questionPromptId, score) VALUES ("Question:\n Compute the Width of a Binary Tree.\n\n Instructions:\n Write a function in Rust that takes the root node of a binary tree as an argument and returns the width of the tree. A tree's width is defined as the maximum number of nodes found on a single level of the tree.\n Get Coding Geek!", 24, 100);
INSERT INTO Question(textContent, questionPromptId, score) VALUES ("Question:\n Given a list of integers, construct a max heap data structure using Rust.\n\n Instructions:\n Create a program that reads in integers from a list and builds the data structure of a max heap. At the end of the program, the data structure should be completely built. Make sure to create methods to add a single element, remove single element, and switch elements within the heap. Remember to pass in the root node to the methods that swap and add elements. Once the data structure is ready, print it out and make sure the elements are in the correct order.\n Get Coding Geek!", 25, 100);
INSERT INTO Question(textContent, questionPromptId, score) VALUES ("Question:\n Implement a max heap with the ability to push and pop elements in Rust, using the following prototype. void push(int); int pop();\n\n Instructions:\n Write a Rust program to create a max heap and store integer elements and then implement the push() and pop() methods, which will maintain the heap invariant. Input: An array of integers. Output: Elements of the heap after push() and pop() operations.\n Get Coding Geek!", 26, 100);
INSERT INTO Question(textContent, questionPromptId, score) VALUES ("Question:\n\n Implement Heaps using Rust.\n\n Instructions:\n Using Rust, write a program that creates a min heap data structure. Implement functions for inserting elements into the heap, removing elements from the heap, and returning the root element. Also, consider memory efficiency when writing your code.\n Get Coding Geek!", 27, 100);


INSERT INTO Question(textContent, questionPromptId, score) VALUES ("Question:\n\n Build a Javascript function that takes two numbers as arguments and returns the sum!\n Get Coding Geek!", 28, 100);

INSERT INTO Question(textContent, questionPromptId, score, assignment) VALUES ("Question:\n\n Build a Javascript function that takes two numbers as arguments and returns the difference!\n Get Coding Geek!", 28, 100, 1);



-- INSERT INTO Badge(name, threshold, iconpath, title) VALUES('Python Medium Badge', 10, '/images/languageIcons/PYTHON_LOGO.svg', 'Python Virtuoso');
SET @mvp_badge_id = LAST_INSERT_ID();
-- Password is mvpPass
INSERT INTO Users (username, firstName, lastName, email, password, userRoleId) VALUES ('mvpUser', 'MVP','User','mvp@gmail.com', '$2b$12$FV6CfOWLmZa46qrNzYiE6OYlGNJxy/d2jPaRY1B.RbwsWdH7eoR4W', 1);

SET @mvp_user_id = LAST_INSERT_ID();
INSERT INTO Learner (userId, points, exp, level, selectedBadgeTitleId) VALUES(@mvp_user_id, 1000, 1200, 14, @mvp_badge_id);

INSERT INTO LearnerQuestions(userId, questionId, completed) VALUES (@mvp_user_id, 1, 1);
INSERT INTO LearnerQuestions(userId, questionId, completed) VALUES (@mvp_user_id, 2, 1);
INSERT INTO LearnerQuestions(userId, questionId, completed) VALUES (@mvp_user_id, 3, 1);
INSERT INTO LearnerQuestions(userId, questionId, completed) VALUES (@mvp_user_id, 4, 1);
INSERT INTO LearnerQuestions(userId, questionId, completed) VALUES (@mvp_user_id, 5, 0);
INSERT INTO LearnerQuestions(userId, questionId, completed) VALUES (@mvp_user_id, 6, 0);
INSERT INTO LearnerQuestions(userId, questionId, completed) VALUES (@mvp_user_id, 7, 0);
INSERT INTO LearnerQuestions(userId, questionId, completed) VALUES (@mvp_user_id, 8, 0);
INSERT INTO LearnerQuestions(userId, questionId, completed) VALUES (@mvp_user_id, 9, 1);
INSERT INTO LearnerQuestions(userId, questionId, completed) VALUES (@mvp_user_id, 10, 1);
INSERT INTO LearnerQuestions(userId, questionId, completed) VALUES (@mvp_user_id, 11, 1);

INSERT INTO `LearnerStudyLog` (`userId`, `studyDate`, `studyHours`) VALUES
(@mvp_user_id, '2023-06-01', 1.5),
(@mvp_user_id, '2023-06-02', 2.0),
(@mvp_user_id, '2023-06-03', 2.5),
(@mvp_user_id, '2023-06-04', 1.0),
(@mvp_user_id, '2023-06-05', 2.2),
(@mvp_user_id, '2023-06-06', 1.8),
(@mvp_user_id, '2023-06-07', 2.1),
(@mvp_user_id, '2023-06-08', 1.7),
(@mvp_user_id, '2023-06-09', 2.0),
(@mvp_user_id, '2023-06-10', 2.3);



INSERT INTO Assignment(moduleId, name, numberOfQuestions, topicId, proficiencyLevelId, programmingLanguageId, createdOn, deadlineDate, status, sampleQuestion) VALUES (1, "Practice Hashing", 10, 2, 1, 2, CURRENT_DATE, DATE_ADD(now(), INTERVAL 10 DAY), 1, "THIS IS SAMPLE Q1");
INSERT INTO Assignment(moduleId, name, numberOfQuestions, topicId, proficiencyLevelId, programmingLanguageId, createdOn, deadlineDate, status, sampleQuestion) VALUES (1, "Practice Arrays", 10, 1, 1, 2, CURRENT_DATE, DATE_ADD(now(), INTERVAL 10 DAY), 1, "THIS IS SAMPLE Q2");
INSERT INTO Assignment(moduleId, name, numberOfQuestions, topicId, proficiencyLevelId, programmingLanguageId, createdOn, deadlineDate, status, sampleQuestion) VALUES (1, "Practice Trees", 10, 8, 1, 2, CURRENT_DATE, DATE_ADD(now(), INTERVAL 10 DAY), 1, "THIS IS SAMPLE Q3");
INSERT INTO Assignment(moduleId, name, numberOfQuestions, topicId, proficiencyLevelId, programmingLanguageId, createdOn, deadlineDate, status, sampleQuestion) VALUES (2, "Practice Hashing", 10, 2, 1, 3, CURRENT_DATE, DATE_ADD(now(), INTERVAL 10 DAY), 1, "THIS IS SAMPLE Q4");
INSERT INTO Assignment(moduleId, name, numberOfQuestions, topicId, proficiencyLevelId, programmingLanguageId, createdOn, deadlineDate, status, sampleQuestion) VALUES (2, "Practice Arrays", 10, 1, 1, 3, CURRENT_DATE, DATE_ADD(now(), INTERVAL 10 DAY), 1, "THIS IS SAMPLE Q5");
INSERT INTO Assignment(moduleId, name, numberOfQuestions, topicId, proficiencyLevelId, programmingLanguageId, createdOn, deadlineDate, status, sampleQuestion) VALUES (2, "Practice Trees", 10, 8, 1, 3, CURRENT_DATE, DATE_ADD(now(), INTERVAL 10 DAY), 1, "THIS IS SAMPLE Q6");

INSERT INTO AssignmentQuestion(assignmentId, questionId) VALUES (1, 1);
INSERT INTO AssignmentQuestion(assignmentId, questionId) VALUES (1, 2);
INSERT INTO AssignmentQuestion(assignmentId, questionId) VALUES (1, 29);
INSERT INTO AssignmentQuestion(assignmentId, questionId) VALUES (6, 1);
INSERT INTO AssignmentQuestion(assignmentId, questionId) VALUES (6, 2);

INSERT INTO StudentAssignmentQuestion(userId, classId, assignmentId, questionId, partialAnswer, timeTaken, completed) VALUES (1, 1, 6, 1, "Test Answer", 0, 1);
INSERT INTO StudentAssignmentQuestion(userId, classId, assignmentId, questionId, partialAnswer, timeTaken) VALUES (1, 1, 6, 2, "Test Answer 2", 0);

INSERT INTO StudentAssignmentQuestion(userId, classId, assignmentId, questionId, partialAnswer, timeTaken, completed) VALUES (1, 1, 1, 29, "function sub(x,y){return x-y;};", 1.2, 0);
