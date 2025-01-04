import express from "express"
import { activate, suspend, isSuspended, updateReportStatus } from "../controllers/adminController.js";
import {authenticateToken} from "../config/middlewares.js";

const adminRouter = express.Router()


adminRouter.post("/suspend", authenticateToken, suspend)
adminRouter.post("/activate", authenticateToken, activate)
adminRouter.get("/suspension/:email", authenticateToken, isSuspended)


export default adminRouter