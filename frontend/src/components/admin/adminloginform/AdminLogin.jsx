import React, { useState } from 'react';
import './AdminLogin.css'
import 'boxicons';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { userLogin } from '../../../services/userApi';

export const AdminLogin = () => {
    const [isRegistering, setIsRegistering] = useState(false);

    const handleRegisterClick = () => {
        setIsRegistering(true);
    };

    const handleLoginClick = () => {
        setIsRegistering(false);
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate()

    const onSubmit = async (data) => {
        try {
            const response = await userLogin(data)
            console.log(response);


            if (response.success) {
                toast.success('Welcome back!');
                navigate('/admin');
            } else {
                // Handle the case where the login is not successful, even if there's no error
                toast.error('Login failed. Please check your credentials.');
            }
        } catch (error) {
            toast.error('Login failed. Something went wrong.');
            console.log(error);
        }
    }

    return (
        <div className="container">
            <div className={`Form login-form ${isRegistering ? 'active' : ''}`}>
                {/* <h2>Login</h2> */}
                <form action="#" onSubmit={handleSubmit(onSubmit)}>
                    <div className="input-box">
                        <label htmlFor="#">Email</label>
                        <i className='bx bxs-envelope'></i>
                        <input type="email" {...register("email")} placeholder="Enter Your Email*" />
                    </div>
                    <div className="input-box">
                        <i className='bx bxs-lock-alt'></i>
                        <input type="password" {...register("password")} placeholder="Enter Your Password*" />
                        <label htmlFor="#">Password</label>
                    </div>
                    <div className="forgot-section">
                        <span>
                            <input type="checkbox" name="" id="checked" /> Remember Me
                        </span>
                        <span>
                            <a href="#">Forgot Password?</a>
                        </span>
                    </div>
                    <button type="submit" className="btn">Login</button>
                </form>
                <p>Or Sign up using</p>
                <div className="social-media">
                    <i className='bx bxl-facebook'></i>
                    <i className='bx bxl-google'></i>
                    <i className='bx bxl-twitter'></i>
                </div>
                <p className="RegisteBtn RegiBtn" onClick={handleRegisterClick}>
                    <a href="#">Register Now</a>
                </p>
            </div>

            <div className={`Form Register-form ${isRegistering ? 'active' : ''}`}>
                {/* <h2>Register</h2> */}
                <form action="#">
                    <div className="input-box">
                        <i className='bx bxs-envelope'></i>
                        <label htmlFor="#">Name</label>
                        <input type="text" placeholder="Enter Your Name*" />
                    </div>
                    <div className="input-box">
                        <i className='bx bxs-envelope'></i>
                        <label htmlFor="#">Email</label>
                        <input type="text" placeholder="Enter Your Email*" />
                    </div>
                    <div className="input-box">
                        <i className='bx bxs-lock-alt'></i>
                        <input type="password" placeholder="Enter Your Password*" />
                        <label htmlFor="#">Password</label>
                    </div>
                    <div className="input-box">
                        <i className='bx bxs-lock-alt'></i>
                        <input type="password" placeholder="Enter your Role*" />
                        <label htmlFor="#">Role</label>
                    </div>
                    <div className="forgot-section">
                        <span>
                            <input type="checkbox" name="" id="checked" /> Remember Me
                        </span>
                        <span>
                            <a href="#">Forgot Password?</a>
                        </span>
                    </div>
                    <button className="btn">Register</button>
                </form>
                <p>Or Sign up using</p>
                <div className="social-media">
                    <i className='bx bxl-facebook'></i>
                    <i className='bx bxl-google'></i>
                    <i className='bx bxl-twitter'></i>
                </div>
                <p className="LoginBtn" onClick={handleLoginClick}>
                    <a href="#">Login Now</a>
                </p>
            </div>
        </div>
    );
};
