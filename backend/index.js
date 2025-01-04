import express from 'express';
import cors from 'cors';
import dotenv from "dotenv"
import { connectDB } from './config/db.js';
import router from './routes/route.js';
import adminRouter from './routes/adminRoute.js';
import chatRouter from './routes/chatRoute.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import chatSocket from './socket/chatSocket.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ||  5001;

const server = createServer(app);
const io = new Server(server, {
  cors: {
      origin: "*",
      methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

app.use("",router)
app.use("/admin",adminRouter)

connectDB();    

// Start Server
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

