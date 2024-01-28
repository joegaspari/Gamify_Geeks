import { Model, DataTypes } from "sequelize";
import sequelize from "./database.js";

class Question extends Model {}

Question.init(
    {
        questionId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        textContent: {
            type: DataTypes.STRING(1000),
            allowNull: false,
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        questionPromptId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Question",
        tableName: "Question",
        timestamps: false,
    }
);

export default Question;
