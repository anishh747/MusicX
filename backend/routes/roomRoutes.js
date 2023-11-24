import express from "express";
import {createRoom, endRoom, joinRoom, inviteToRoom} from "../controllers/roomController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/createRoom',createRoom);

router.post('/inviteRoom',inviteToRoom);

router.post('/joinRoom',joinRoom);

router.delete('/endRoom',endRoom);

export default router;