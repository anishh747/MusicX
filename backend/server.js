import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import userRoutes from "./routes/userRoutes.js";
import musicRoutes from "./routes/musicRoutes.js";
import roomRoutes from "./routes/roomRoutes.js  ";
import userPlaylistRoutes from "./routes/userPlaylistRoutes.js  ";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io";

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
const httpServer = createServer(app);
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/music", musicRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/userplaylist", userPlaylistRoutes);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    socket.on("joinRoomCode", (roomInfo) => {
        let roomCode = roomInfo.room_id;
        socket.join(roomCode);
        // Send a message to all members in the room (including the sender)
        io.to(roomCode).emit("message", "A user has joined the room");
        io.to(roomCode).emit("memberJoined", roomInfo.username);
        console.log("A user:"+ roomInfo.username);
        // Listen for chat messages
        socket.on("chatMessage", (data) => {
            io.to(roomCode).emit("receiveChatMessage", data);
        });

        // Listen for room ended by host
        socket.on("endRoom", () => {
            console.log("Room Ended");
            io.to(roomCode).emit("endRoom");
        });

        // Message on disconnection
        socket.on("disconnect", () => {
            io.to(roomCode).emit("message", "A user has left the room");
            console.log("A user Disconnected");
        });

        socket.on("exitRoom", (data) => {
            io.to(roomCode).emit("exitRoom", data);
        });
        
        socket.on("playSong", (data) => {
            console.log("Playing Song")
            io.to(roomCode).emit("playSong", data);
        });

        socket.on("playPause", () => {
            io.to(roomCode).emit("playPause");
        });

        socket.on("playNextSong", () => {
            io.to(roomCode).emit("playNextSong");
        });

        socket.on("playPreviousSong", () => {
            io.to(roomCode).emit("playPreviousSong");
        });

        socket.on("addToQueue", (data) => {
            io.to(roomCode).emit("addToQueue", data);
        });
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});

app.get("/", (req, res) => {
    res.send("Server is ready");
});

// app.listen(PORT, () => {
//     console.log("Server started");
// });
