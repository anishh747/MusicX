import { pool } from "../db.js"; 
import expressAsyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import e from "express";

const registerUser = expressAsyncHandler(async(req,res) =>{
    try {
        let {email,name,password} = req.body;
        const checkUser = await pool.query("SELECT * FROM users WHERE email = ($1)",[email])
        if (checkUser.rowCount !== 0) {
            throw new Error("USER ALREADY EXISTS")
        }else{
    
            const salt = await bcrypt.genSalt(5);
            password = await bcrypt.hash(password,salt)
    
            const register = await pool.query("INSERT INTO users (email, name,password) VALUES ($1,$2,$3) ",[email,name,password])
            const user = await pool.query("SELECT id FROM users WHERE email = ($1)",[email])
            generateToken(res, user.rows.id);
            res.status(201);
            res.json(register);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


//public route
const authUser = expressAsyncHandler(async(req,res) =>{
        const {email,password} = req.body;
        const checkUser = await pool.query("SELECT id FROM users WHERE email = ($1)",[email])
        if (checkUser.rowCount !== 0) {
            const userDetails = await pool.query("SELECT * FROM users WHERE email = ($1)",[email])
            if (await bcrypt.compare(password,userDetails.rows[0].password)) {
                generateToken(res,checkUser.rows[0].id)
                res.status(201)
                res.json(userDetails)
            }else{
                res.status(401)
                throw new Error("Invalid Email or Password")
            }
        }else{
            res.status(401)
            throw new Error("Invalid Email or Password")
        }
});


const logOutUser = expressAsyncHandler(async(req,res) =>{
    res.cookie('jwt','',{
        httpOnly: true,
        expires: new Date(0)
    })

    res.status(200).json({message: "Logged Out Successfully"})
});

const updatePassword = expressAsyncHandler(async(req,res) =>{
    const {oldPassword,newPassword,email} = req.body;
    const checkUser = await pool.query("SELECT * FROM users WHERE email = ($1)",[email])
    if (checkUser.rowCount !== 0) {
        const userDetails = await pool.query("SELECT * FROM users WHERE email = ($1)",[email])
        if (await bcrypt.compare(oldPassword,userDetails.rows[0].password)) {
            const salt = await bcrypt.genSalt(5);
            const newPasswordHash = await bcrypt.hash(newPassword,salt)
            const updatePassword = await pool.query("UPDATE users SET password = ($1) WHERE email = ($2)",[newPasswordHash,email])
            res.status(201)
            res.json(updatePassword)
        }else{
            res.status(401)
            throw new Error("Invalid Password")
        }
    }else{
        res.status(401)
        throw new Error("Invalid Email or Password")
    }
})

export  {authUser,registerUser,logOutUser,updatePassword};