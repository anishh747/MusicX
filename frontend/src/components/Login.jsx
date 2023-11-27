import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import mic from '../images/listening.jpg'
const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, { isLoading }] = useLoginMutation();
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            navigate('/')
            console.log(userInfo)
        } else {
            console.log("No userInfo");
        }
    }, [navigate, userInfo])

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const res = await login({ email, password }).unwrap();
            dispatch(setCredentials({ ...res }))
            navigate('/')
        } catch (err) {
            // toast.error(err?.data?.message || err.error)
        }
    }

    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-gray-700">
                <div
                    className="relative flex flex-col m-6 space-y-8 bg-gray-400 shadow-2xl rounded-2xl md:flex-row md:space-y-0"
                >

                    <form className="flex flex-col justify-center p-8 md:p-14" onSubmit={handleSubmit}>
                        <span className="mb-3 text-4xl font-bold">Welcome back</span>
                        <span className="font-light text-gray-400 mb-8">
                            Welcome back! Please enter your details
                        </span>
                        <div className="py-4">
                            <label htmlFor="email" className="mb-2 text-md">Email</label>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                type="email"
                                className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                                name="email"
                                id="email"
                            />
                        </div>
                        <div className="py-4">
                            <label htmlFor="password" className="mb-2 text-md">Password</label>
                            <input
                                onChange={(e) => setPassword(e.target.value)} value={password} type="password" id="password"
                                className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                            />
                        </div>
                        <div className="flex justify-between w-full py-4">
                            <div className="mr-24">
                                <input type="checkbox" name="ch" id="ch" className="mr-2" />
                                <span className="text-md">Remember for 30 days</span>
                            </div>
                            <span className="font-bold text-md">Forgot password</span>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-black text-white p-2 rounded-lg mb-6 hover:bg-white hover:text-black hover:border hover:border-gray-300"
                        >
                            Sign in
                        </button>
                        <button
                            className="w-full border border-gray-300 text-md p-2 rounded-lg mb-6 hover:bg-black hover:text-white"
                        >
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/120px-Google_%22G%22_logo.svg.png?20230822192911" alt="img" className="w-6 h-6 inline mr-2" />
                            Sign in with Google
                        </button>

                        <div className="flex justify-between items-center w-full text-gray-400">
                            <hr className="border-gray-400 w-1/4" />
                            <span className="text-center text-md">OR</span>
                            <hr className="border-gray-400 w-1/4" />
                        </div>

                        <div className="text-md flex justify-center items-center">
                            <span className="mr-8 font-bold">New to musicX ?</span>
                            <Link to={'/register'} className="text-white hover:underline space-x-3 font-bold">       Register</Link>
                        </div>
                    </form>




                    <div className="relative">
                        <img
                            src={mic}
                            alt="img"
                            className="w-[600px] h-full hidden rounded-r-2xl md:block object-cover"
                        />
                        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold flex items-center">
                            <div className="lg:text-6xl ">MUSIC</div>
                            <div className="lg:text-8xl ml-0">X</div>
                        </div>
                        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold items-center">
                            <div className="text-l font-thin">All your favourite song in one place</div>
                        </div>
                        {/* <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold items-center text-center">
                            <div className="text-8xl">FEEL</div>
                            <div className="text-8xl">THE</div>
                            <div className="text-8xl">MUSIC</div>
                        </div> */}

                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;