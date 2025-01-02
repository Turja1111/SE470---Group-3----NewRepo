import express from 'express';
import cors from 'cors';
import dotenv from "dotenv"
import { connectDB } from './config/db.js';
import router from './routes/route.js';
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

app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());

app.use("",router)



chatSocket(io);

connectDB();    

// Start Server
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

