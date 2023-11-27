import express from "express";
import {createRoom, endRoom, joinRoom, inviteToRoom, getRoomData} from "../controllers/roomController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/createRoom',createRoom);

router.post('/inviteRoom',inviteToRoom);

router.get('/roomInfo/:id',getRoomData);

router.post('/joinRoom',joinRoom);

router.delete('/endRoom',endRoom);

export default router;