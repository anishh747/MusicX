import { useParams } from "react-router-dom";
import { useEndRoomMutation, useRoomInfoMutation } from "../slices/roomApiSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Room = () => {
    const { id: room_id } = useParams();
    const [endRoom] = useEndRoomMutation();
    const [getRoomInfo] = useRoomInfoMutation();
    const navigate = useNavigate();

    const handleEndRoom = async () => {
        const endRoomQuery = await endRoom({ room_id });
        navigate('/');
    }


    useEffect(() => {
        async function fetchRoomInfo() {
            try {
                const response = await getRoomInfo(room_id);
                if (response?.data?.rowCount === 1) {
                    console.log(response.data.rows[0]);
                } else {
                    throw new Error("Invalid Room ID");
                }
            } catch (error) {
                toast.error(error.message);
            }
        }
        fetchRoomInfo();
    }, [room_id]);

    return (
        <>
            <h1 className="text-5xl">ROOM</h1>
            <h1 className="text-5xl">ROOM ID: {room_id}</h1>
            <button onClick={handleEndRoom} type="button" className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                EndRoom
            </button>
        </>
    );
}

export default Room;