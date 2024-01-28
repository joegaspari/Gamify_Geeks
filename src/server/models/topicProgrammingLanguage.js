import { Model, DataTypes } from "sequelize";
import sequelize from "./database.js";

class TopicProgrammingLanguage extends Model {}

TopicProgrammingLanguage.init(
    {
        programmingLanguageId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        topicId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "TopicProgrammingLanguage",
        tableName: "TopicProgrammingLanguage",
        timestamps: false,
    }
);

export default TopicProgrammingLanguage;
