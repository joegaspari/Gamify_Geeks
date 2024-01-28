import * as sMods from '../data/modules.js';


export async function getClassModule(req, res) {
    try {

        const userId = req.query.studentId ? req.query.studentId : req.userId;
        const classId = req.query.classId;
        if (!userId || !classId) {
            return res.status(400).json({ error: 'All fields userId, classId are required.' });
        };
        const result = await sMods.getClassModulesAssignments(userId, classId);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to getClassModule' });
    }
};

export async function getInstructorModules(req, res) {
    try {
        const userId = req.userId;
        const classId = req.query.classId;
        console.log(userId, classId)
        if (!userId || !classId) {
            return res.status(400).json({ error: 'All fields userId, classId are required.' });
        };
        const result = await sMods.getInstructorClassModulesAssignments(userId, classId);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to getInstructorModule' });
    }
};

export async function createModule(req, res) {
    try {
        const classId = req.body.classId;
        const name = req.body.name;
        if (!name|| !classId) {
            return res.status(400).json({ error: 'All fields name, classId are required.' });
        };
        const result = await sMods.createModule(name, classId);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message || 'Failed to getClassModule' });
    }
}



export async function deleteModule(req, res){
    try{
        if (!req.query.moduleId || !req.query.classId){
            return res.status(400).json({ error: 'All fields moduleId and classId are required.' });
        }
        const moduleId = req.query.moduleId;
        const classId = req.query.classId;

        const result = await sMods.inactivateModule(moduleId, classId);

        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Failed to inactivate module'
        });
    }
};

export async function changeVisibility(req, res){
    try{
        if (!req.body.moduleId || !req.body.classId){
            return res.status(400).json({ error: 'All fields moduleId and classId are required.' });
        }

        const moduleId = req.body.moduleId;
        const classId = req.body.classId;

        const result = await sMods.changeVis(moduleId, classId);

        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Failed to change module visibility'
        });
    }
};

