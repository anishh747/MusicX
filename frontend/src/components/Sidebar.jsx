import { Dialog, Transition } from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";
import { Fragment, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";
import { useLogoutMutation } from "../slices/usersApiSlice";
import {
    useGetPlaylistsMutation,
    useCreatePlaylistMutation,
    useDeletePlaylistMutation,
} from "../slices/playlistApiSlice";
import "./Navbar/navbar.css";
import { MdPlaylistAdd } from "react-icons/md";
import { MdPlaylistPlay } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Sidebar() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [playlistName, setPlaylistName] = useState("");
    const [userPlaylists, setUserPlaylists] = useState();
    const [fetchPlaylistsData] = useGetPlaylistsMutation();
    const [createPlaylist] = useCreatePlaylistMutation();
    const [deletePlaylist] = useDeletePlaylistMutation();
    const { userInfo } = useSelector((state) => state.auth);
    const [logoutMutation] = useLogoutMutation();
    const roomInfo = useSelector((state) => state.room.roomInfo);

    const handleLogoutButton = async () => {
        try {
            await logoutMutation().unwrap();
            dispatch(logout());
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        async function fetchData() {
            if (userInfo) {
                try {
                    const playlistResponse = await fetchPlaylistsData(
                        userInfo.id
                    ).unwrap();
                    setUserPlaylists(playlistResponse.rows);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
        }
        fetchData();
    }, [userInfo]);

    const [isModalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const submitCreatePlaylist = async (e) => {
        e.preventDefault();
        try {
            const res = await createPlaylist({
                playlistName,
                userId: userInfo.id,
            }).unwrap();
            console.log(res);
            toast.success("Playlist created successfully");
            closeModal();
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeletePlaylist = async (playlistId) => {
        try {
            const response = await deletePlaylist({
                playlistId,
            });

            if (response.error) {
                console.error("Error deleting playlist:", response.error);
            } else if (response.data) {
                console.log("Playlist deleted successfully:", response.data);
                toast.success("Playlist deleted successfully");
            } else {
                console.error("Unexpected response:", response);
            }
        } catch (error) {
            console.error("An unexpected error occurred:", error);
        }
    };


    return (
        <>
            <button
                type="button"
                className="rounded-md relative top-3 left-3 bg-white p-2 text-gray-400 lg:hidden"
                onClick={() => setOpen(true)}
            >
                <span className="sr-only">Open menu</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                </svg>
            </button>
            <div className=" bg-black sticky top-0 z-50  ">
                <Transition.Root show={open} as={Fragment}>
                    <Dialog
                        as="div"
                        className="relative z-40 lg:hidden"
                        onClose={setOpen}
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-opacity-25" />
                        </Transition.Child>

                        <div className="fixed inset-0 z-40 flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <Dialog.Panel className="bg-black relative flex w-full max-w-xs flex-col overflow-y-auto shadow-xl">
                                    <div className="logo">
                                        <Link to={`/`}>
                                            <img src="https://firebasestorage.googleapis.com/v0/b/facebook-clone-e980a.appspot.com/o/musicx-logo.png?alt=media&token=57d2eefb-0bca-49a7-9870-6d860b623ffd" />
                                        </Link>
                                    </div>
                                    <div className="absolute right-0 top-0">
                                        <button
                                            type="button"
                                            className="inline-flex items-center justify-center rounded-md text-white"
                                            onClick={() => setOpen(false)}
                                        >
                                            <span className="sr-only">Close menu</span>
                                            <RxCross2 className="text-3xl" />
                                        </button>
                                    </div>
                                    <div className="space-y-4 border-t border-gray-200 px-4 py-2">
                                        <ul>
                                            <li className="nav-link">
                                                <Link to={`/`}>
                                                    <button className="home-btn text-white">Home</button>
                                                </Link>
                                            </li>
                                            <li className="nav-link">
                                                {roomInfo ? (
                                                    <Link to={`/room/${roomInfo.room_id}`}>
                                                        <button className="goto-room-btn text-white">Go to Room</button>
                                                    </Link>
                                                ) : (
                                                    <Link to="create-join">
                                                        <button className="join-room-btn text-white">Join Room</button>
                                                    </Link>
                                                )}
                                            </li>
                                            <li className="nav-link">
                                                {userInfo ? (
                                                    <Link to={`favourites`}>
                                                        <button className="favourite-btn text-white">Favourites</button>
                                                    </Link>
                                                ) : (
                                                    <Link to="/login">
                                                        <button className="favourite-btn text-white">Favourites</button>
                                                    </Link>
                                                )}
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="playlist-content p-4 text-white rounded-md">
                                        <div className="playlist-caption flex items-center justify-between mb-4">
                                            <h2 className="text-2xl font-bold">My Playlists</h2>
                                            <button
                                                className="text-2xl hover:bg-green-600 transition-colors"
                                                onClick={openModal}
                                            >
                                                <MdPlaylistAdd />
                                            </button>
                                            {isModalOpen && (
                                                <div className="modal-content">
                                                    <span className="close" onClick={closeModal}>
                                                        &times;
                                                    </span>
                                                    <h3 className="text-lg font-bold mb-2">Create Playlist</h3>
                                                    <form onSubmit={submitCreatePlaylist}>
                                                        <label htmlFor="playlistName" className="block mb-2">
                                                            Playlist Name:
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="playlistName"
                                                            name="playlistName"
                                                            placeholder="Enter playlist name"
                                                            value={playlistName}
                                                            onChange={(e) => setPlaylistName(e.target.value)}
                                                            className="w-full p-2 border border-gray-500 rounded-md mb-4 focus:outline-none focus:border-blue-500"
                                                        />
                                                        <div className="button-container">
                                                            <button
                                                                type="submit"
                                                                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600 transition-colors"
                                                            >
                                                                Submit
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            )}
                                        </div>
                                        <div className="playlist-list">
                                            <ul className="list-none items-start">
                                                {userPlaylists &&
                                                    userPlaylists.map((item) => (
                                                        <li
                                                            key={item.playlist_id}
                                                            className="mb-2 flex items-center justify-between"
                                                        >
                                                            <div className="flex items-center">
                                                                <MdPlaylistPlay className="text-gray-500 mr-2 text-2xl" />
                                                                <Link
                                                                    to={`myPlaylist/${item.playlist_id}`}
                                                                    className="text-white-300 hover:underline transition-colors"
                                                                >
                                                                    {item.title}
                                                                </Link>
                                                            </div>
                                                            <MdDelete
                                                                className="text-white-500 hover:text-red-600 cursor-pointer"
                                                                onClick={() => handleDeletePlaylist(item.playlist_id)}
                                                            />
                                                        </li>
                                                    ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="bottom-content">
                                        <ul>
                                            <li className="nav-link">
                                                {userInfo ? (
                                                    <button onClick={handleLogoutButton} className="logout-btn">
                                                        Log Out
                                                    </button>
                                                ) : (
                                                    <Link to="/login">
                                                        <button className="signin-btn">Sign In</button>
                                                    </Link>
                                                )}
                                            </li>
                                        </ul>
                                    </div>

                                    {userInfo ? (
                                        <div className="profile-section">
                                            <div className="profile-info">
                                                <img
                                                    src="https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg"
                                                    className="profile-img"
                                                />
                                                <div>
                                                    <span>{userInfo.name}</span>
                                                    <Link to="/profile">View profile</Link>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>
            </div>
        </>
    );
}
