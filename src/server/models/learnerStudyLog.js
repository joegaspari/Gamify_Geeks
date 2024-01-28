import { Model, DataTypes } from "sequelize";
import sequelize from "./database.js";

class LearnerStudyLog extends Model {}

LearnerStudyLog.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: "Learner",
                key: "userId",
            },
        },
        studyDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            primaryKey: true,
        },
        studyHours: {
            type: DataTypes.DECIMAL(4, 2),
            allowNull: false,
            defaultValue: 0.0,
        },
    },
    {
        sequelize,
        modelName: "LearnerStudyLog",
        tableName: "LearnerStudyLog",
        timestamps: false,
    }
);

export default LearnerStudyLog;
