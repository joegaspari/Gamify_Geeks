import {Model,  DataTypes} from 'sequelize'
import sequelize from './database.js'

class UserMilestone extends Model {}

UserMilestone.init({
    milestoneId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    objective: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    progress: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },

},{
    sequelize,
    tableName: 'UserMilestone',
    modelName: 'UserMilestone',
    timestamps: false
})

export default UserMilestone;