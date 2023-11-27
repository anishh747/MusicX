import { pool } from "../db.js"; 
import expressAsyncHandler from "express-async-handler";

const createRoom = expressAsyncHandler(async(req,res) =>{
    try {
        let {room_id, host} = req.body;
        let changed_room_id =  room_id.replace(/-/g, '_');
        const room = await pool.query("INSERT INTO rooms (room_id, host_email) VALUES($1,$2)",[changed_room_id,host])
        const checkRoom = await pool.query("SELECT * FROM rooms WHERE room_id = ($1)",[changed_room_id]);
        if (checkRoom.rowCount === 1) {
            res.status(201).json("Room Created Successfully"); 
        }
        else{
            throw new Error("Room Not Created");
        }
    } catch (error) {
        res.status(404).json({message: error.message})
    }
});

const getRoomData = expressAsyncHandler(async (req, res) => {
    try {
      let { id } = req.params;
      let changed_room_id = id.replace(/-/g, '_');
      const roomData = await pool.query("SELECT * FROM rooms WHERE room_id = ($1)", [changed_room_id]);
      
      if (roomData.rowCount === 1) {
        res.status(200).json(roomData);
    } else {
        res.status(404).json({ message: "Room Not Found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });


//public route
const joinRoom = expressAsyncHandler(async(req,res) =>{
    try {
        const {room_id,email} = req.body;
        let changed_room_id =  room_id.replace(/-/g, '_');
        const checkRoomExists = await pool.query("SELECT * FROM rooms WHERE room_id = ($1)",[changed_room_id])
        
        if (checkRoomExists.rowCount !== 0) {
            res.json(checkRoomExists)    
        }else{
            throw new Error("Room Doesn't Exists");
        }
    } catch (error) {
        res.status(404).json() 
    }
});


const endRoom = expressAsyncHandler(async(req,res) =>{
    const {room_id} = req.body;
    let changed_room_id =  room_id.replace(/-/g, '_');

    const deleteRoomFromRoomTable  = await pool.query("DELETE FROM rooms WHERE room_id = ($1)",[changed_room_id]);
    
    res.status(200).json({message: "Room Ended Successfully"})
});

const inviteToRoom = expressAsyncHandler(async(req,res) =>{

});

export  {createRoom, endRoom, getRoomData, joinRoom, inviteToRoom};