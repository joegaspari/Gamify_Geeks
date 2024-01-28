import express from "express";
import "express-async-errors";
import * as q from "../controller/questions.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/getQ", isAuth, q.getQuestion);

router.post("/onSave", isAuth, q.onSave);

router.post("/answer", isAuth, q.checkAnswer);

router.post("/hint", q.hint);

router.post("/report", isAuth, q.report);

router.get("/test", isAuth, q.test);

export default router;
