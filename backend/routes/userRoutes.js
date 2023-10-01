import express from "express";
import {authUser,registerUser,logOutUser} from "../controllers/userController.js";

const router = express.Router();

router.post('/',registerUser);

router.post('/auth',authUser);

router.post('/logout',logOutUser);


export default router;