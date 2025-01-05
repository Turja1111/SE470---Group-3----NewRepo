import express from "express";
import { getChats, sendMessage, createChat } from "../controllers/chatController.js";
import {authenticateToken} from "../config/middlewares.js";

const chatRouter = express.Router();

chatRouter.get("/", authenticateToken, getChats);
chatRouter.post("/create", authenticateToken, createChat);

export default chatRouter;