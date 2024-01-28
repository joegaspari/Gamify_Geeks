import { Model, DataTypes } from "sequelize";
import sequelize from "./database.js";

class BadgeNotification extends Model {}

BadgeNotification.init(
    {
        notificationId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        badgeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "BadgeNotification",
        tableName: "BadgeNotification",
        timestamps: false,
    }
);

export default BadgeNotification;
