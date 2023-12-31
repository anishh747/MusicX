import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUpdatePasswordMutation } from '../slices/usersApiSlice'

export default function Profile() {
    const { userInfo } = useSelector((state) => state.auth);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [updatePassword, { isLoading, error, isSuccess }] = useUpdatePasswordMutation();
    const navigate = useNavigate();

    const changePassword = async () => {
        if (oldPassword === "" || newPassword === "" || confirmNewPassword === "") {
            toast.error("Please fill all the fields")
        }
        else if (newPassword !== confirmNewPassword) {
            toast.error("Passwords do not match!")
        }
        else {
            const response = await updatePassword({ oldPassword, newPassword, email: userInfo.email });
            if (response.data !== undefined) {
                toast.success("Password changed successfully!")
            } else {
                toast.error("Incorrect Password")
            }
        }
    }

    useEffect(() => {
        if (!userInfo) {
            navigate('/login')
        }
    }, [userInfo]);

    return (
        <main
            key="1"
            className="relative flex flex-col items-center justify-center p-8 min-h-screen bg-gradient-to-br from-black to-gray-900"
        >
            <div className="w-full max-w-md mx-auto bg-gray-800 text-white p-6 rounded-lg shadow-2xl flex flex-col space-y-6">
                <div className="py-4">
                    <h2 className="text-4xl font-bold text-green-500">MusicX Account Settings</h2>
                    <p className="text-lg font-medium text-gray-300">Manage your MusicX account and preferences</p>
                </div>
                <div className="flex flex-col items-center justify-center space-y-6 py-4">
                    <div className="h-36 w-36 rounded-full overflow-hidden bg-gray-700 shadow-lg">
                        <img
                            alt="User avatar"
                            className="h-full w-full object-cover items-center"
                            height="144"
                            src="https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg"
                            style={{
                                aspectRatio: "144/144",
                                objectFit: "cover",
                            }}
                            width="144"
                        />
                    </div>
                    {
                        userInfo ? <h1 className="text-3xl font-semibold text-gray-200">{userInfo?.name}</h1> :
                            <h1 className="text-3xl font-semibold text-gray-200">Your Name</h1>
                    }
                    <div className="w-full py-3 px-5 border border-[#1DB954] text-white rounded-lg bg-gray-700 shadow-md flex items-center space-x-2">
                        <span className="w-5 h-5 mr-2 text-green-500">👤</span>
                        <input className="w-full bg-transparent text-white outline-none" disabled value={userInfo?.email} />
                    </div>
                    <div className="w-full py-3 px-5 border border-[#1DB954] text-white rounded-lg bg-gray-700 shadow-md flex items-center space-x-2">
                        <span className="w-5 h-5 mr-2 text-green-500">🔒</span>
                        <input
                            className="w-full bg-transparent text-white outline-none"
                            placeholder="Current Password"
                            required
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                    </div>
                    <div className="w-full py-3 px-5 border border-[#1DB954] text-white rounded-lg bg-gray-700 shadow-md flex items-center space-x-2">
                        <span className="w-5 h-5 mr-2 text-green-500">🔒</span>
                        <input
                            className="w-full bg-transparent text-white outline-none"
                            placeholder="New Password"
                            required
                            type="password"
                            value={newPassword}
                            onChange={(e) => { setNewPassword(e.target.value) }}
                        />
                    </div>
                    <div className="w-full py-3 px-5 border border-[#1DB954] text-white rounded-lg bg-gray-700 shadow-md flex items-center space-x-2">
                        <span className="w-5 h-5 mr-2 text-green-500">🔒</span>
                        <input
                            className="w-full bg-transparent text-white outline-none"
                            placeholder="Confirm Password"
                            required
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                    </div>
                    <button onClick={changePassword} className="w-full py-3 px-5 border border-[#1DB954] text-white rounded-lg bg-[#1DB954] shadow-md">
                        Save
                    </button>
                </div>
                <button className="self-end mt-6 py-3 px-5 text-red-500 rounded-lg bg-gray-700 shadow-md">Logout</button>
            </div>
        </main>
    )
}

