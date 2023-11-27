import React, { useEffect, useState } from 'react'
import {  v4 as uuidv4  } from 'uuid';
import { useCreateRoomMutation, useRoomInfoMutation } from '../slices/roomApiSlice';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateJoinRoom = () => {
    const navigate = useNavigate();
    const [inputRoomCode, setInputRoomCode] = useState('');
    const [createRoom, { data, isLoading, isError, isSuccess, error }] = useCreateRoomMutation();
    const [getRoomInfo] = useRoomInfoMutation();
    const {userInfo} = useSelector((state) => state.auth);

    useEffect(() => {
        if(!userInfo){
            navigate('/login');   
        }
        // console.log(userInfo?.rows[0]?.email);
    },[userInfo]);

    const handleCreateRoom = async () => {
        try {
            const room_id = uuidv4();
            const create = await createRoom({ room_id, host: userInfo?.rows[0]?.email });
            console.log(create);
            navigate(`/room/${room_id}`)
        } catch (error) {
            console.log(error.message)
        }
    };

    const handleJoinRoom = async () => {
        try {
            const response = await getRoomInfo(inputRoomCode);
            if (response?.data?.rowCount === 1) {
                console.log(response.data.rows[0]);
            } else {
                throw new Error("Invalid Room ID");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <>
        <h1 className="text-3xl">Create or Join Leagues & Cups</h1>
        <p className="text-2xl">Join invitational room to listen with friends</p>
            <div className="mb-5">
                <label htmlFor="room-code" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter Room Code</label>
                <input value={inputRoomCode} onChange={(e)=>{setInputRoomCode(e.target.value)}} type="text" id="room-code" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
            </div>
            <button onClick={handleJoinRoom} type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Join Room</button>
            <h1 className="text-3xl">OR</h1>
            <p className="text-2xl">Create your own room</p>
            <button onClick={handleCreateRoom} type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Create Room</button>
        </>
    );
}

export default CreateJoinRoom;