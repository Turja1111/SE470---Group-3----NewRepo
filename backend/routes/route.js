import express from "express"
import { signup, login, verifyEmail, confirmEmail, sendPasswordResetEmail, resetPassword} from "../controllers/All.js"
import { authenticateToken } from "../config/middlewares.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)

router.post('/verify-email', authenticateToken, verifyEmail);
router.get('/confirm-email', confirmEmail )
router.post('/reset-password', sendPasswordResetEmail)
router.post('/confirm-reset-password', resetPassword)


export default router