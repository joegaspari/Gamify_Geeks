import { Model, DataTypes } from "sequelize";
import sequelize from "./database.js";

class AssignmentQuestion extends Model {}

AssignmentQuestion.init(
    {
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
    },
    {
        sequelize,
        modelName: "AssignmentQuestion",
        tableName: "AssignmentQuestion",
        timestamps: false,
    }
);

export default AssignmentQuestion;
