import { Model, DataTypes } from "sequelize";
import sequelize from "./database.js";

class QuestionPrompt extends Model {}

QuestionPrompt.init(
    {
        questionPromptId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        topicId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        programmingLanguageId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        proficiencyLevelId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "QuestionPrompt",
        tableName: "QuestionPrompt",
        timestamps: false,
    }
);

export default QuestionPrompt;
