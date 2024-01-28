import { Model, DataTypes } from "sequelize";
import sequelize from "./database.js";

class Institution extends Model {}

Institution.init(
    {
        institutionId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        institutionCode: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Institution",
        tableName: "Institution",
        timestamps: false,
    }
);

export default Institution;
