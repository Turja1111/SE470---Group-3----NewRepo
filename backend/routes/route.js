import express from "express"
import { getPosts, createPost,  upvotePost, addComment,} from "../controllers/All.js"
import { authenticateToken } from "../config/middlewares.js"

const router = express.Router()


router.get('/posts', getPosts)
router.post('/posts', authenticateToken, createPost);
router.post('/posts/:id/upvote', authenticateToken, upvotePost);
router.post('/posts/:id/comments', authenticateToken, addComment);



export default router