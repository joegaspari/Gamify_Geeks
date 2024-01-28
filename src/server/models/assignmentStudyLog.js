import { Model, DataTypes } from "sequelize";
import sequelize from "./database.js";

class AssignmentStudyLog extends Model {}

AssignmentStudyLog.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        assignmentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        studyDate: {
            type: DataTypes.DATE,
            primaryKey: true,
            allowNull: false,
        },
        studyHours: {
            type: DataTypes.DECIMAL(4, 2),
            allowNull: false,
            defaultValue: 0.0,
        },
    },
    {
        sequelize,
        modelName: "AssignmentStudyLog",
        tableName: "AssignmentStudyLog",
        timestamps: false,
    }
);

export default AssignmentStudyLog;
