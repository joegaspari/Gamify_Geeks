import { Model, DataTypes } from "sequelize";
import sequelize from "./database.js";

class Learner extends Model {}

Learner.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        exp: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        level: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        selectedBadgeTitleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: "Learner",
        tableName: "Learner",
        timestamps: false, // assuming you don't have created_at and updated_at fields
    }
);

export default Learner;
