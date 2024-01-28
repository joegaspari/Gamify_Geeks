import { Model, DataTypes } from "sequelize";
import sequelize from "./database.js";

class ProgrammingLanguage extends Model {}

ProgrammingLanguage.init(
    {
        programmingLanguageId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "ProgrammingLanguage",
        tableName: "ProgrammingLanguage",
        timestamps: false,
    }
);

export default ProgrammingLanguage;
