import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import musicRoutes from "./routes/musicRoutes.js";
import roomRoutes from "./routes/roomRoutes.js  ";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io";

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/music", musicRoutes);
app.use("/api/room", roomRoutes);

const io = new Server(5001, {
    cors: {
        origin: "http://localhost:9000",
    },
});

io.on("connection", (socket) => {

    console.log("a user connected");
    
    socket.on('joinRoomCode',(roomCode)=>{
        socket.join(roomCode);
        
        // Send a message to all members in the room (including the sender)
        io.to(roomCode).emit('message', 'A user has joined the room');
        
        // Listen for chat messages
        socket.on('chatMessage',(data)=>{
            io.to(roomCode).emit("receiveChatMessage", data);
        });
        
        // Message on disconnection
        socket.on('disconnect',()=>{
            io.to(roomCode).emit('message','A user has left the room');
            console.log("A user Disconnected");
      });
    });
  });

io.listen(5173);

app.get("/", (req, res) => {
    res.send("Server is ready");
});

app.listen(PORT, () => {
    console.log("Server started");
});
