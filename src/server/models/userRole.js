import { Model, DataTypes } from "sequelize";
import sequelize from "./database.js";

class UserRole extends Model {}

UserRole.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
    },
    {
        sequelize,
        modelName: "UserRole",
        tableName: "UserRole",
        timestamps: false,
    }
);

export default UserRole;
