import { useSelector } from "react-redux"
export default function Profile() {
    const { userInfo } = useSelector((state) => state.auth);
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
                            src="/placeholder.svg"
                            style={{
                                aspectRatio: "144/144",
                                objectFit: "cover",
                            }}
                            width="144"
                        />
                    </div>
                    {
                        userInfo ? <h1 className="text-3xl font-semibold text-gray-200">{userInfo.name}</h1> :
                            <h1 className="text-3xl font-semibold text-gray-200">Your Name</h1>
                    }
                    <div className="w-full py-3 px-5 border border-[#1DB954] text-white rounded-lg bg-gray-700 shadow-md flex items-center space-x-2">
                        <span className="w-5 h-5 mr-2 text-green-500">👤</span>
                        <input className="w-full bg-transparent text-white" placeholder="Username" />
                    </div>
                    <div className="w-full py-3 px-5 border border-[#1DB954] text-white rounded-lg bg-gray-700 shadow-md flex items-center space-x-2">
                        <span className="w-5 h-5 mr-2 text-green-500">🔒</span>
                        <input
                            className="w-full bg-transparent text-white"
                            placeholder="Current Password"
                            required
                            type="password"
                        />
                    </div>
                    <div className="w-full py-3 px-5 border border-[#1DB954] text-white rounded-lg bg-gray-700 shadow-md flex items-center space-x-2">
                        <span className="w-5 h-5 mr-2 text-green-500">🔒</span>
                        <input className="w-full bg-transparent text-white" placeholder="New Password" required type="password" />
                    </div>
                    <div className="w-full py-3 px-5 border border-[#1DB954] text-white rounded-lg bg-gray-700 shadow-md flex items-center space-x-2">
                        <span className="w-5 h-5 mr-2 text-green-500">🔒</span>
                        <input
                            className="w-full bg-transparent text-white"
                            placeholder="Confirm Password"
                            required
                            type="password"
                        />
                    </div>
                    <button className="w-full py-3 px-5 border border-[#1DB954] text-white rounded-lg bg-[#1DB954] shadow-md">
                        Save
                    </button>
                </div>
                <button className="self-end mt-6 py-3 px-5 text-red-500 rounded-lg bg-gray-700 shadow-md">Logout</button>
            </div>
        </main>
    )
}

