import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "express-async-errors";
import * as userModel from "../data/auth.js";
import config from "../config.js";
import { findByInstitutionCode } from "../data/institution.js";
import nodemailer from "nodemailer";

// async export function
export async function login(req, res) {
  // extracted from the request body
  const { authenticator, password } = req.body;

  const username = !authenticator.includes("@") && authenticator;
  const email = authenticator.includes("@") && authenticator;

  let errors = {};
  // finds a user with a provided input in the database
  const foundUsername = username && (await userModel.findByUsername(username));

  // if no user, 401 status and error message
  if (username && !foundUsername) {
    errors["username"] = `User does not exist!`;
    return res.status(401).json({ message: { ...errors } });
  }

  const foundEmail = email && (await userModel.findByEmail(email));

  if (email && !foundEmail) {
    errors["email"] = `User does not exist!`;
    return res.status(401).json({ message: { ...errors } });
  }

  if (foundUsername.deleted || foundEmail.deleted) {
    errors["username"] = `User does not exist!`;
    return res.status(401).json({ message: { ...errors } });
  }

  const user = foundUsername || foundEmail;
  // if found, bcrypt checks if the provided password matches the hashed password stored in the database
  // bcrypt will automatically hash the plain-text password provided by the user using the same salt that was used when the original password was hashed.
  const isValidPassword = await bcrypt.compare(password, user.password);
  // if they dont match, 401 status and error message -- 401 is used for invalid credentials
  if (!isValidPassword) {
    errors["password"] = `Invalid user or password'`;
    return res.status(401).json({ message: { ...errors } });
  }
  // JSON Web Token created for future authenticated requests by the client
  const token = createJwtToken(user.userId);
  const userRoleId = user.userRoleId;
  const userId = user.userId;
  // function responds with 200 status code and JSON object containing token and username
  res.status(200).json({ token, userId, userRoleId });
}

// In-memory store for verification codes (this is just for demonstration, use a database in production)
const verificationCodes = {};

// Function to register a new user
export async function signup(req, res) {
  // extract username, password, and email from the request body
  const { username, firstName, lastName, password, email, institutionCode, emailVerificationCode } = req.body;
  // extract userRoleId from the query parameters
  const userRoleId = req.query.userRoleId;
  // Check if user already exists
  let errors = {};

  if (verificationCodes[email] !== Number(emailVerificationCode)) {
    errors["emailVerificationCode"] = `Email verification code does not match`;
  }

  const foundUsername = await userModel.findByUsername(username);
  if (foundUsername) {
    errors["username"] = `${username} is already taken`;
  }

  const foundEmail = await userModel.findByEmail(email);
  if (foundEmail) {
    errors["email"] = `${email} is already taken`;
  }

  if (userRoleId === "3") {
    const foundInstitutionCode = await findByInstitutionCode(institutionCode);
    if (!foundInstitutionCode) {
      errors["code"] = `It is not a valid institution code`;
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(401).json({ message: errors });
  }

  // If user doesnt exist, hash provided password
  const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);

  try {
    const institutionCode = req.body.institutionCode;
    // Create new user in database with provided fields
    const user = await userModel.createUser(
      {
        username,
        firstName,
        lastName,
        password: hashedPassword,
        userRoleId,
        email,
      },
      userRoleId,
      institutionCode
    );

    // Create JWT for the user
    const token = createJwtToken(user.userId);
    const userId = user.userId;
    // Respond with 201 status and JSON object
    res.status(201).json({ token, username, userId, userRoleId });
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// Helper function to create a new JWT
function createJwtToken(id) {
  // JWTs are created with payload, secret key and options like expiry date (here 2 days)
  return jwt.sign({ id }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  });
}

export async function me(req, res, next) {
  const user = await userModel.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const { username, userId, userRoleId } = user;

  res.status(200).json({ username, userId, userRoleId });
}

export async function deleteAccount(req, res) {
  const userId = req.userId;

  try {
    await userModel.deleteAccount(userId);
    res.status(200).json({ message: "Account deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function updatePassword(req, res) {
    const userId = req.userId;
    const { newPassword, emailVerificationCode, email } = req.body;
    const errors = {};


  if (verificationCodes[email] !== Number(emailVerificationCode)) {
    errors["emailVerificationCode"] = `Email verification code does not match`;
  }

  const user = await userModel.findById(userId);

    if (!user) {
        errors['user'] = `User does not exist`;
    }

    if (Object.keys(errors).length > 0) {
        return res.status(401).json({ message: { ...errors } });
    }
r

  const hashedPassword = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);
  await userModel.updatePassword(userId, hashedPassword);
  res.status(200).json({ message: "Password updated" });
}

export async function sendVerification(req, res, next) {
  const email = req.body.email;
  const code = Math.floor(100000 + Math.random() * 900000);

  verificationCodes[email] = code;

  setTimeout(() => {
    delete verificationCodes[email];
  }, 3 * 60 * 1000);

  try {
    await sendVerificationEmail(email, code);
    res.status(200).json("Verification email sent!");
  } catch (error) {
    console.error("Error in sendVerification: ", error);
    res.status(500).json({ message: "Failed to send verification email." });
  }
}

const sendVerificationEmail = async (recipientEmail, verificationCode) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.email.email,
      pass: config.email.password,
    },
  });

  const mailOptions = {
    from: config.email.email,
    to: recipientEmail,
    subject: "GamifyGeeks Email Verification",
    text: `Your verification code is: ${verificationCode}`,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
};
