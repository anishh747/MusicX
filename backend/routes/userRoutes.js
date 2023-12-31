import express from "express";
import {authUser,registerUser,logOutUser,updatePassword} from "../controllers/userController.js";
import {protect} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/',registerUser);

router.post('/auth',authUser);

router.post('/logout',logOutUser);

router.put('/update',updatePassword)


export default router;