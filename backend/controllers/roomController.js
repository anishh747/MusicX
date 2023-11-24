import { pool } from "../db.js"; 
import expressAsyncHandler from "express-async-handler";

const createRoom = expressAsyncHandler(async(req,res) =>{
    let {room_id, host} = req.body;
    let changed_room_id =  room_id.replace(/-/g, '_');
    const room = await pool.query("INSERT INTO rooms (room_id, host_email) VALUES($1,$2)",[changed_room_id,host])
    if (room.rowCount === 1) {
        const createTableQuery = `CREATE TABLE ${changed_room_id} (
            user_email VARCHAR(30) NOT NULL,
            hasJoined BOOLEAN NOT NULL
          )`;
        const createTable = await pool.query(createTableQuery);
        res.status(200).json("Room Created Successfully");
    }else{
        res.status(500).json("Internal Error")
    }
});


//public route
const joinRoom = expressAsyncHandler(async(req,res) =>{
    const {room_id,email} = req.body;
    let changed_room_id =  room_id.replace(/-/g, '_');
    const checkRoomExists = await pool.query("SELECT * FROM rooms WHERE room_id = ($1)",[changed_room_id])
    
    if (checkRoomExists.rowCount !== 0) {
        // const roomTableQuery = `SELECT * FROM ${changed_room_id}`;
        // const tableData = await pool.query(roomTableQuery);
        res.json(checkRoomExists)    
    }else{
        res.status(401)
        throw new Error("Room Doesn't Exists");
    }
});


const endRoom = expressAsyncHandler(async(req,res) =>{
    const {room_id, email} = req.body;
    let changed_room_id =  room_id.replace(/-/g, '_');

    const deleteRoomFromRoomTable  = await pool.query("DELETE FROM rooms WHERE room_id = ($1)",[changed_room_id]);
    
    res.status(200).json({message: "Room Ended Successfully"})
});

const inviteToRoom = expressAsyncHandler(async(req,res) =>{

});

export  {createRoom, endRoom, joinRoom, inviteToRoom};