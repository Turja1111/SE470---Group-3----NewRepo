import express from "express"
import { getReports, createReport} from "../controllers/All.js"
import { authenticateToken } from "../config/middlewares.js"

const router = express.Router()

router.get('/reports', authenticateToken, getReports);
router.post('/reports', authenticateToken, createReport);


export default router