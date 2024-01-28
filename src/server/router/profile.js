import express from "express";
import "express-async-errors";
import * as controller from "../controller/profile.js";
import { isAuth } from "../middleware/auth.js";
import { body } from "express-validator";
import validate from "../middleware/validate.js";

const validateAccountInfo = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("username should not be empty!")
        .isLength({ max: 20 })
        .withMessage("username should not be above 20 characters!"),
    body("email").isEmail().normalizeEmail().withMessage("invalid email").isLength({ max: 50 }).withMessage("Email should not be above 50 characters!"),
    body("firstName")
        .trim()
        .notEmpty()
        .withMessage("first name should not be empty!")
        .isLength({ max: 20 })
        .withMessage("First Name should not be above 20 characters!"),
    body("lastName")
        .trim()
        .notEmpty()
        .withMessage("last name should not be empty!")
        .isLength({ max: 20 })
        .withMessage("Last Name should not be above 20 characters!"),
    validate,
];

const router = express.Router();

router.get("/", isAuth, controller.getProfile);
router.get("/classes", isAuth, controller.getClasses);
router.put("/update", isAuth, validateAccountInfo, controller.updateAccount);
router.post("/joinClass", isAuth, controller.joinClass);
router.get("/titles", isAuth, controller.getTitles);

export default router;
