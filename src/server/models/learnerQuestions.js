import { Model, DataTypes } from "sequelize";
import sequelize from "./database.js";

class LearnerQuestions extends Model {}

LearnerQuestions.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        questionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        partialAnswer: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        timeTaken: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        dateCompleted: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        completed: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: "LearnerQuestions",
        tableName: "LearnerQuestions",
        timestamps: false,
    }
);

export default LearnerQuestions;
