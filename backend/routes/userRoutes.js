import express from "express";
import {authUser,registerUser,logOutUser} from "../controllers/userController.js";
import {protect} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/',registerUser);

router.post('/auth',authUser);

router.post('/logout',logOutUser);


export default router;