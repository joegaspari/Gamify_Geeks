import { Model, DataTypes } from "sequelize";
import sequelize from "./database.js";

class Badge extends Model {}

Badge.init(
    {
        badgeId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        threshold: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        iconpath: {
            type: DataTypes.STRING(250),
            allowNull: false,
        },
        proficiencyLevelId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: "Badge",
        tableName: "Badge",
        timestamps: false, // assuming you don't have created_at and updated_at fields
    }
);

export default Badge;
