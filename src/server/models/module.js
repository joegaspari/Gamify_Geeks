import { Model, DataTypes } from "sequelize";
import sequelize from "./database.js";

class Module extends Model {}

Module.init(
    {
        moduleId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        classId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Module",
        tableName: "Module",
        timestamps: false,
    }
);

export default Module;
