import { useParams } from "react-router-dom";
import { useEndRoomMutation, useRoomInfoMutation } from "../slices/roomApiSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { clearRoomData } from '../slices/roomSlice';
import SingleMessage from "./Room/SingleMessage";
import "./Room/ChatBox.css";

const Room = () => {
    const { id: room_id } = useParams();
    const [isHost, setIsHost] = useState(false);
    const dispatch = useDispatch();
    const [endRoom] = useEndRoomMutation();
    const [getRoomInfo] = useRoomInfoMutation();
    const navigate = useNavigate();
    const [socket, setSocket] = useState(null);
    const [allMessages, setAllMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const { userInfo } = useSelector((state) => state.auth);
    const roomInfo = useSelector((state) => state.room.roomInfo);

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        }
        else {
            if (roomInfo?.host_email === userInfo?.email) {
                setIsHost(true);
                console.log("HOST");
            }
        }
    }, [roomInfo, userInfo]);

    useEffect(() => {
        const s = io("https://music-x-backend.onrender.com");
        setSocket(s);

        return () => {
            s.disconnect();
        }
    }, [])

    useEffect(() => {
        if (socket !== null) {
            socket.emit('joinRoomCode', room_id);

            socket.on("message", (message) => {
                console.log(message);
            })

            socket.on("receiveChatMessage", (data) => {
                let updatedData = {};
                updatedData = data;
                setAllMessages((allMessages) => [
                    ...allMessages,
                    { inputMessage: data.inputMessage, userName: data.userName, currentTime: data.currentTime }
                ]
                );
            });
        }
        return () => {
            // Check if socket is not null before calling off method
            if (socket !== null) {
                socket.off("message");
                socket.off("receiveChatMessage");
            }
        }
    }, [socket]);



    const handleEndRoom = async () => {
        const endRoomQuery = await endRoom({ room_id });
        dispatch(clearRoomData());
        navigate('/');
    }

    const handleLeaveRoom = async () => {
        dispatch(clearRoomData());
        navigate('/');
    }

    const onSendMessage = (e) => {
        e.preventDefault();
        console.log("CHAT SUBMIT");
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const currentTime = `${hours}:${minutes}`;
        let userName = userInfo?.email;
        socket.emit('chatMessage', { inputMessage, userName, currentTime })
        setInputMessage('')
    }

    useEffect(() => {
        const chatMessages = document.getElementById('chat-messages')
        chatMessages.scrollTop = chatMessages.scrollHeight;

    }, [allMessages])

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

            {
                isHost ? (
                    <button onClick={handleEndRoom} type="button" className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                        EndRoom
                    </button>
                ) : (
                    <button onClick={handleLeaveRoom} type="button" className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                        Leave Room
                    </button>
                )
            }
            <div className="chat-container">
                <header className="chat-header">
                    <h1><i className="fas fa-smile"></i> SXYNIX</h1>
                </header>
                <main className="chat-main">
                    <div className="chat-messages" id='chat-messages'>
                        {
                            allMessages.map((msg, index) => (
                                <SingleMessage key={index} name={msg.userName} displayTime={msg.currentTime} message={msg.inputMessage} />
                            ))
                        }
                    </div>
                </main>
                <div className="chat-form-container">
                    <form id="chat-form" onSubmit={onSendMessage}>
                        <input
                            id="msg"
                            value={inputMessage}
                            type="text"
                            placeholder="Enter Message"
                            required
                            autoComplete="off"
                            onChange={(e) => {
                                setInputMessage(e.target.value)
                            }}
                        />
                        <button type="submit" className="btn"><i className="fas fa-paper-plane"></i>Send</button>
                    </form>
                </div>
            </div>

        </>
    );
}

export default Room;