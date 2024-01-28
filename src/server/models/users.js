import { Model, DataTypes } from "sequelize";
import sequelize from "./database.js";

class Users extends Model {}

Users.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userRoleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdOn: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        deleted: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
        },
        deletedOn: {
            type: DataTypes.DATE,
        },
    },
    {
        sequelize,
        modelName: "Users",
        tableName: "Users",
        timestamps: false,
    }
);

export default Users;
