import { Model, DataTypes } from "sequelize";
import sequelize from "./database.js";

class ClassNotification extends Model {}

ClassNotification.init(
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
        classId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "ClassNotification",
        tableName: "ClassNotification",
        timestamps: false, // assuming you don't have created_at and updated_at fields
    }
);

export default ClassNotification;
