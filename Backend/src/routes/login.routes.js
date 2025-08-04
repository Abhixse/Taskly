import express from "express"
import loginControllers from "../controllers/login.controllers.js"

const router = express.Router();

router.route("/").post(loginControllers)

export default router;
