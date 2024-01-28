import { Model, DataTypes } from "sequelize";
import sequelize from "./database.js";

class Instructor extends Model {}

Instructor.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        institutionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Instructor",
        tableName: "Instructor",
        timestamps: false,
    }
);

export default Instructor;
