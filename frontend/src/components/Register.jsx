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
<<<<<<< HEAD
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
=======
            <div className="register flex flex-col justify-center items-center">
                <h2><b>Register</b></h2>
                <form className="reg-form min-w-[500px] " onSubmit={handleSubmit}>
                    <div className="relative z-0 w-full mb-6 group">
                        <input value={email} onChange={(e) => { setEmail(e.target.value) }} type="email" name="floating_email" id="floating_email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                        <input value={password} onChange={(e) => { setPassword(e.target.value) }} type="password" name="floating_password" id="floating_password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="floating_password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                        <input value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} type="password" name="repeat_password" id="floating_repeat_password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="floating_repeat_password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Confirm password</label>
                    </div>
                    <div className="grid md:grid-cols-2 md:gap-6">
                        <div className="relative z-0 w-full mb-6 group">
                            <input value={name} onChange={(e) => { setName(e.target.value) }} type="text" name="floating_first_name" id="floating_first_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                            <label htmlFor="floating_first_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name</label>
>>>>>>> b996ec6079ab7ee62e9829e7953d66ffc8027f28
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