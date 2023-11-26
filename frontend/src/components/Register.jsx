import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { toast } from "react-toastify";
import { setCredentials } from "../slices/authSlice";
import 'react-toastify/dist/ReactToastify.css';
import mic from '../images/musicaes (1).jpg'
const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('')

    const { userInfo } = useSelector((state) => state.auth);
    const [register, { isLoading }] = useRegisterMutation();

    useEffect(() => {
        if (userInfo) {
            navigate('/')
            console.log(userInfo)
        } else {
            console.log("No userInfo");
        }
    }, [navigate, userInfo])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!")
        } else {
            try {
                const res = await register({ email, name, password }).unwrap();
                dispatch(setCredentials({ ...res }))
                navigate('/')
            } catch (error) {
                toast.error(err?.data?.message || err.error)
            }
        }
    }

    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-gray-700">
                <div
                    className="relative flex flex-col m-6 space-y-8 bg-gray-400 shadow-2xl rounded-2xl md:flex-row md:space-y-0"
                >

                    <form className="flex flex-col justify-center p-8 md:p-14" onSubmit={handleSubmit}>
                        <span className="mb-3 text-4xl font-bold">Register</span>
                        <span className="font-light text-gray-400 mb-8">
                            Join us to
                        </span>
                        <div className="flex justify-between w-full space-x-2">
                            <div className="py-4 w-48">
                                <label htmlFor="firstname" className="mb-2 text-md">First name</label>
                                <input
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                                    name="firstname"
                                    id="firstname"
                                />
                            </div>

                            <div className="py-4 w-48">
                                <label htmlFor="lastname" className="mb-2 text-md">Last name</label>
                                <input


                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                                    name="lastname"
                                    id="lastname"
                                />
                            </div>
                        </div>

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
                        <div className="py-4">
                            <label htmlFor="Confirm_password" className="mb-2 text-md">Confirm Password</label>
                            <input
                                onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} type="password" id="password"
                                className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                            />
                        </div>


                        <button
                            type="submit"
                            className="w-full bg-black text-white p-2 rounded-lg mb-6 hover:bg-white hover:text-black hover:border hover:border-gray-300"
                        >
                            Register
                        </button>





                        <div className="text-md flex justify-center items-center">
                            <span className="mr-8 font-bold">Already have an account?</span>
                            <Link to={'/login'} className="text-white hover:underline space-x-3 font-bold">Login</Link>
                        </div>
                    </form>




                    <div className="relative">
                        <img
                            src={mic}
                            alt="img"
                            className="w-[500px] h-full hidden rounded-r-2xl md:block object-cover"
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

export default Register;