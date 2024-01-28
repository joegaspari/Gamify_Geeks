import { Model, DataTypes } from "sequelize";
import sequelize from "./database.js";

class LearnerBadges extends Model {}

LearnerBadges.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        badgeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        dateObtained: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: "LearnerBadges",
        tableName: "LearnerBadges",
        timestamps: false,
    }
);

export default LearnerBadges;
