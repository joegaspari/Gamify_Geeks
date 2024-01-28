import sequelize from "../models/database.js";
import { Op } from "sequelize";
import Users from "../models/users.js";
import Learner from "../models/learner.js";
import { findByInstitutionCode } from "./institution.js";
import Instructor from "../models/instructor.js";

// fetches one record from the 'Users' table where the username filed matches the provided username
export async function findByUsername(username) {
    // equivalent to SELECT * FROM Users WHERE username = authenticator OR email = authenticator LIMIT 1;
    return Users.findOne({ where: { username: username } });
}

export async function findByEmail(email) {
    // equivalent to SELECT * FROM Users WHERE email = email LIMIT 1;
    return Users.findOne({ where: { email: email } });
}

export async function createUser(user, userRoleId, institutionCode) {
    // we are using a transaction here because we can perform multi tables operations and rollback in case of an error
    const t = await sequelize.transaction();
    try {
        const newUser = await Users.create(user, { transaction: t });
        if (userRoleId === "1") {
            // creates a new record in the 'Learner' table
            await Learner.create({ userId: newUser.userId, selectedBadgeTitleId: 1 }, { transaction: t });
        } else if (userRoleId === "3") {
            // Find institution with provided code
            const institution = await findByInstitutionCode(institutionCode);
            if (!institution) {
                throw new Error("Institution not found"); // Or handle this in another appropriate way
            }
            // Extract the institution's ID
            const institutionId = institution.institutionId;
            // Use the transaction to create a new record in Instructor table
            await Instructor.create({ userId: newUser.userId, institutionId }, { transaction: t });
        }
        // if no error is thrown before that, commit transaction to make all changes permanent
        await t.commit();
        // Return new user
        return newUser;
    } catch (err) {
        // if there was an error, rollback transaction to undo all changes
        await t.rollback();
        console.log(err); // log for debugging purposes
        throw err; // throw err
    }
}

export async function findById(id) {
    try {
        // Tries to find a user by its primary key
        const user = await Users.findByPk(id);

        // Checks if a user was found
        if (!user) {
            // Throws an error if no user is found
            throw new Error("User not found");
        }

        // Returns the found user
        return user;
    } catch (err) {
        // Logs the error for debugging purposes
        console.error(err);
        // Rethrows the error
        throw err;
    }
}

export async function deleteAccount(userId) {
    try {
        // Tries to find a user by its primary key
        const user = await Users.findByPk(userId);

        // Checks if a user was found
        if (!user) {
            // Throws an error if no user is found
            throw new Error("User not found");
        }

        // Updates the 'deleted' value to 1
        user.deleted = 1;
        user.deletedOn = new Date(); // Set the deletion timestamp

        await user.save();

        // Returns the updated user
        // TODO: Don't archive data, simply remove account and all associated data
        return user;
    } catch (err) {
        // Logs the error for debugging purposes
        console.error(err);
        // Rethrows the error
        throw err;
    }
}

export async function updatePassword(userId, newPassword) {
    try {
        // Tries to find a user by its primary key
        const user = await Users.findByPk(userId);

        // Checks if a user was found
        if (!user) {
            // Throws an error if no user is found
            throw new Error("User not found");
        }

        // Updates the user's password
        user.password = newPassword;

        // Saves the user
        await user.save();

        // Returns the found user
        return user;
    } catch (err) {
        // Logs the error for debugging purposes
        console.error(err);
        // Rethrows the error
        throw err;
    }
}
