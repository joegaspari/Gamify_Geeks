import { Model, DataTypes } from "sequelize";
import sequelize from "./database.js";

class Milestone extends Model {}

Milestone.init(
    {
        milestoneId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        badgeId: {
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
        imagePath: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "Milestone",
        modelName: "Milestone",
        timestamps: false,
    }
);

export default Milestone;
