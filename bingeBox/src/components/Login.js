import React, { useState } from 'react';
import Header from './Header';
import axios from "axios";
import { API_END_POINT } from '../utils/constant';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from '../redux/userSlice';

const Login = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoading = useSelector(store => store.app.isLoading);

    const loginHandler = () => {
        setIsLogin(!isLogin);
    };

    const getInputData = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));
        if (isLogin) {
            //login
            const user = { email, password };
            try {
                const res = await axios.post(`${API_END_POINT}/login`, user, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                });
                if (res.data.success) {
                    toast.success(res.data.message);
                }
                dispatch(setUser(res.data.user));
                navigate("/browse");
            } catch (error) {
                toast.error(error.response.data.message);
                console.log(error);
            } finally {
                dispatch(setLoading(false));
            }
        } else {
            //register
            dispatch(setLoading(true));
            const user = { fullName, email, password };
            try {
                const res = await axios.post(`${API_END_POINT}/register`, user, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                });
                if (res.data.success) {
                    toast.success(res.data.message);
                }
                setIsLogin(true);
            } catch (error) {
                toast.error(error.response.data.message);
                console.log(error);
            } finally {
                dispatch(setLoading(false));
            }
        }
        setFullName("");
        setEmail("");
        setPassword("");
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <Header />
            <div className="container mx-auto px-4 py-8 flex justify-center items-center h-full">
                <form onSubmit={getInputData} className='w-full max-w-md bg-gray-800 rounded-lg px-8 pt-6 pb-8'>
                    <h1 className='text-3xl text-white mb-5 font-bold text-center'>{isLogin ? "Login" : "Sign Up"}</h1>
                    {!isLogin && (
                        <div className="mb-4">
                            <label className="block text-white text-sm font-bold mb-2" htmlFor="fullName">
                                Full Name
                            </label>
                            <input
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                type='text'
                                placeholder='Full Name'
                                className='w-full bg-gray-700 text-white rounded-sm py-2 px-4'
                            />
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-white text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type='email'
                            placeholder='Email'
                            className='w-full bg-gray-700 text-white rounded-sm py-2 px-4'
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type='password'
                            placeholder='Password'
                            className='w-full bg-gray-700 text-white rounded-sm py-2 px-4'
                        />
                    </div>
                    <button type='submit' className={`w-full bg-pink-500 hover:bg-pink-600 text-white rounded-full font-medium py-3 px-4 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}>
                        {isLoading ? "Loading..." : (isLogin ? "Login" : "Sign Up")}
                    </button>
                    <p className='text-white mt-4 text-center'>
                        {isLogin ? "New to BingeBox?" : "Already have an account?"}
                        <span onClick={loginHandler} className='ml-1 text-blue-900 font-medium cursor-pointer'>
                            {isLogin ? "Sign Up" : "Login"}
                        </span>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Login;
