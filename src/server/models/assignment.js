import { Model, DataTypes, Sequelize } from "sequelize";
import sequelize from "./database.js";

class Assignment extends Model {}

Assignment.init(
    {
        assignmentId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        moduleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        numberOfQuestions: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        topicId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        proficiencyLevelId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        programmingLanguageId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        createdOn: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        deadlineDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        visible: {
            type: DataTypes.BOOLEAN,
            defaultValue: 1,
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: 1,
            allowNull: false,
        },
        sampleQuestion: {
            type: DataTypes.TEXT,
        },
    },
    {
        sequelize,
        modelName: "Assignment",
        tableName: "Assignment",
        timestamps: false,
    }
);

export default Assignment;
