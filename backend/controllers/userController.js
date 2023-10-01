import { pool } from "../db.js"; 
import expressAsyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

const registerUser = expressAsyncHandler(async(req,res) =>{
    let {email,name,password} = req.body;
    const checkUser = await pool.query("SELECT * FROM users WHERE email = ($1)",[email])
    if (checkUser.rowCount !== 0) {
        res.status(400);
        throw new Error("USER ALREADY EXISTS")
    }else{

        const salt = await bcrypt.genSalt(5);
        password = await bcrypt.hash(password,salt)

        const register = await pool.query("INSERT INTO users (email, name,password) VALUES ($1,$2,$3) ",[email,name,password])
        const user = await pool.query("SELECT id FROM users WHERE email = ($1)",[email])
        generateToken(res, user.rows.id);
        res.json(register);
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

export  {authUser,registerUser,logOutUser};