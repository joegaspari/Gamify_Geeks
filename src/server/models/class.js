import { Model, DataTypes } from "sequelize";
import sequelize from "./database.js";

class Class extends Model {}

Class.init(
    {
        classId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(256),
            allowNull: true,
        },
        joinCode: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        created: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: "Class",
        tableName: "Class",
        timestamps: false, // assuming you don't have created_at and updated_at fields
    }
);

export default Class;
