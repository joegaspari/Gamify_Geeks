import * as profileModel from "../data/profile.js";
import * as userModel from "../data/auth.js";
import { findByInstitutionId } from "../data/institution.js";

export async function getProfile(req, res) {
    const studentId = req.query.studentId;
    const userId = studentId ? studentId : req.userId;

    const user = await profileModel.findByUserId(userId);

    if (!user) {
        return res.status(401).json({ message: "User does not exist!" });
    }

    const firstName = user.firstName;
    const lastName = user.lastName;
    const name = firstName + lastName;
    const username = user.username;
    const email = user.email;

    let profile = "";

    console.log(user);

    if (user.userRoleId == 1) {
        const learner = await profileModel.findLearnerByUserId(userId);
        if (!learner) {
            return res.status(401).json({ message: "Learner does not exist!" });
        }
        const favoriteBadgeId = learner.selectedBadgeTitleId;
        const badge = await profileModel.getFavoriteBadge(favoriteBadgeId);
        if (!badge) {
            return res.status(401).json({ message: "Badge title does not exist!" });
        }

        // const role = user.userRoleId == 2? 'Student':'Learner';
        const title = badge.title;
        const titleId = badge.badgeId;
        const profileImg = null;
        const bannerImg = null;
        const level = learner.level;
        const streakDays = null;

        profile = {
            id: userId,
            name,
            firstName,
            lastName,
            username,
            email,
            // role,
            userRoleId: user.userRoleId,
            title,
            titleId,
            profileImg,
            bannerImg,
            level,
            streakDays,
        };
    } else if (user.userRoleId == 3) {
        const instructor = await profileModel.findInstructorbyUserId(userId);
        if (!instructor) {
            return res.status(401).json({ message: "Instructor does not exist! " });
        }
        const institution = await findByInstitutionId(instructor.institutionId);

        // const role = 'Instructor';
        const institutionCode = instructor.institutionCode;
        const institutionName = institution.name;

        profile = {
            id: userId,
            name,
            firstName,
            lastName,
            username,
            email,
            // role,
            userRoleId: user.userRoleId,
            institutionCode,
            institutionName,
        };
    }

    res.status(200).json(profile);
}

export async function getClasses(req, res) {
    try {
        const userId = req.userId;
        const search = req.query.search || "";
        const user = await profileModel.findByUserId(userId);
        let data = {};
        if (user.userRoleId == 1) {
            const classes = await profileModel.findClasses(userId, search);
            data = classes.map((classData) => {
                return {
                    classId: classData.classStudent.classId,
                    name: classData.classStudent.name,
                    description: classData.classStudent.description,
                    img: null,
                    joinCode: classData.classStudent.joinCode || null,
                };
            });
        } else if (user.userRoleId == 3) {
            const classes = await profileModel.findInstructorClasses(userId, search);
            if (classes) {
                data = classes.map((classData) => {
                    return {
                        classId: classData.classId,
                        name: classData.name,
                        description: classData.description,
                        img: null,
                        joinCode: classData.joinCode,
                    };
                });
            }
        }
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

export async function joinClass(req, res) {
    const joinCode = req.body.joinCode;
    const userId = req.userId;

    const schoolClass = await profileModel.findClassByJoinCode(joinCode);
    if (schoolClass) {
        // check if student is not already in the class
        const inClass = await profileModel.findStudentClass(userId, schoolClass.classId);
        if (!inClass) {
            const joined = await profileModel.joinClass(userId, schoolClass.classId);
            const data = {
                classId: schoolClass.classId,
                name: schoolClass.name,
                description: schoolClass.description,
                img: null, // to change
            };
            res.status(201).json(data);
        } else {
            // student already in class no need to insert
            res.status(409).json({ message: "You are already in that class!" });
        }
    } else {
        return res.status(404).json({ message: "Invalid Join Code" });
    }
}

export async function updateAccount(req, res) {
    const { username, firstName, lastName, email, usernameChanged, emailChanged, firstNameChanged, lastNameChanged, userTitle } = req.body;
    const userId = req.userId;

    let errors = {};
    const foundUsername = usernameChanged && (await userModel.findByUsername(username));
    if (foundUsername) {
        errors["username"] = `${username} is already taken`;
    }

    const foundEmail = emailChanged && (await userModel.findByEmail(email));
    if (foundEmail) {
        errors["email"] = `${email} is already taken`;
    }

    if (Object.keys(errors).length > 0) {
        return res.status(409).json({ message: errors });
    }

    try {
        await profileModel.updateLearnerSelectedBadge(userId, userTitle);
        const updatedUser = await profileModel.updateUser(userId, { username, firstName, lastName, email });

        res.status(200).json(updatedUser);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}

export async function getTitles(req, res) {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({ error: "userId is required." });
        }
        const result = await profileModel.getUserTitles(userId);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to save partial answer" });
    }
}
