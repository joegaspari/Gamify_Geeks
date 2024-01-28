import { Model, DataTypes } from "sequelize";
import sequelize from "./database.js";

class Topic extends Model {}

Topic.init(
    {
        topicId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        views: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        bugsReported: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: "Topic",
        tableName: "Topic",
        timestamps: false,
    }
);

export default Topic;
