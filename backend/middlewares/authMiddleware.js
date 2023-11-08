import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import { pool } from "../db.js";

const protect = expressAsyncHandler(async(req,res,next)=>{
    let token;
    token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
            req.user = await pool.query("SELECT * FROM users WHERE id=$1",[decoded.userID])
            next();
        } catch (error) {
            res.status(401);;
            throw new Error("Not Authorized, Invalid Token"); 
        }
    }else{
        res.status(401);;
        throw new Error("Not Authorized, No Token");
    }
})

export {protect};