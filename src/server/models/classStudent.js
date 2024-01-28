import { Model, DataTypes } from "sequelize";
import sequelize from "./database.js";

class ClassStudent extends Model {}

ClassStudent.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        classId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "ClassStudent",
        tableName: "ClassStudent",
        timestamps: false,
    }
);

export default ClassStudent;
