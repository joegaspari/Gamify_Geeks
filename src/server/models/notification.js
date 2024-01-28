import { Model, DataTypes } from "sequelize";
import sequelize from "./database.js";

class Notification extends Model {}

Notification.init(
    {
        notificationId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING(1000),
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        status: {
            type: DataTypes.TINYINT,
            default: 0,
        },
    },
    {
        sequelize,
        modelName: "Notification",
        tableName: "Notification",
        timestamps: false,
    }
);

export default Notification;
