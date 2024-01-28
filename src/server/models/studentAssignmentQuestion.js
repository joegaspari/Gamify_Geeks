import { Model, DataTypes } from "sequelize";
import sequelize from "./database.js";

class StudentAssignmentQuestion extends Model {}

StudentAssignmentQuestion.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        classId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        assignmentId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        questionId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        partialAnswer: {
            type: DataTypes.TEXT,
        },
        timeTaken: {
            type: DataTypes.DECIMAL(4, 2),
        },
        dateCreated: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        dateCompleted: {
            type: DataTypes.DATE,
        },
        completed: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: "StudentAssignmentQuestion",
        tableName: "StudentAssignmentQuestion",
        timestamps: false,
    }
);

export default StudentAssignmentQuestion;
