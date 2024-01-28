import Instructor from "../models/instructor.js";
import Class from "../models/class.js";
import sequelize from "../models/database.js";
import Module from "../models/module.js";
import Assignment from "../models/assignment.js";


import { Sequelize } from "sequelize";
import ClassStudent from "../models/classStudent.js";

export async function newClass(userId, name, description, joinCode) {
    return Class.create({userId, name, description, joinCode});
}

export async function findClassExistence(userId, name, description) {
    return Class.findOne({where: {userId, name, description}});
}

export async function getClasses(userId) {
    return Class.findAll({
        where: {
            userId
        },
        attributes: [
            'classId',
            'name',
            'description',
            'joinCode',
            [Sequelize.literal('(SELECT COUNT(*) FROM ClassStudent WHERE ClassStudent.classId = Class.classId)'), 'studentNumber'],
            [Sequelize.fn('date_format', Sequelize.col('Class.created'), '%Y-%m-%d'), 'created']
        ],
        include: [
            {
                model: ClassStudent,
                as: 'classStudent',
                attributes: [] 
            }
        ],
        group: ['Class.classId', 'Class.name', 'Class.description', 'Class.created'],
        order: [[Sequelize.col('Class.created'), 'DESC']],
        raw: true
    });
}

export async function updateClass(userId, classId, name, description) {
    const updatedClass = await Class.update({
            name: name,
            description: description
        },
        {
            where: { classId, userId }
        }
    );

    return await Class.findOne({
        where: {classId, userId}
    })
}

export async function deleteClassById(classId) {
    return sequelize.transaction(async (t) => {
        // Get all modules for this class
        const modules = await Module.findAll({
            where: {
                classId
            }
        });


        // For each module, delete all assignments associated with this module
        for (let i = 0; i < modules.length; i++) {
            await Assignment.destroy({
                where: {
                    moduleId: modules[i].moduleId
                },
                transaction: t
            });
        }

        // Then, delete all modules associated with this class
        await Module.destroy({
            where: {
                classId
            },
            transaction: t
        });


        // Then, delete all ClassStudent records associated with this class
        await ClassStudent.destroy({
            where: {
                classId
            },
            transaction: t
        });


        // Finally, delete the class itself
        return Class.destroy({
            where: {
                classId
            },
            transaction: t
        });
    });
}