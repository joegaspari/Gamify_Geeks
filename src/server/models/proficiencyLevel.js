import { Model, DataTypes } from "sequelize";
import sequelize from "./database.js";

class ProficiencyLevel extends Model {}

ProficiencyLevel.init(
    {
        proficiencyLevelId: {
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
        modelName: "ProficiencyLevel",
        tableName: "ProficiencyLevel",
        timestamps: false,
    }
);

export default ProficiencyLevel;
