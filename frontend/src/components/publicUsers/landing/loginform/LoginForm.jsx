import React, { useState } from 'react';
import './LoginForm.css'
import 'boxicons';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { userLogin, userSignUp } from '../../../../services/userApi';

export const LoginForm = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    setIsRegistering(true);
  };

  const handleLoginClick = () => {
    setIsRegistering(false);
  };

  // Separate useForm instances for login and signup
  const loginForm = useForm();
  const signupForm = useForm();

  const onSubmitLogin = async (data) => {
    try {
      const response = await userLogin(data);
      console.log(response);

      if (response.success) {
        toast.success('Welcome back!');
        navigate('/user');
      } else {
        toast.error('Login failed. Please check your credentials.');
      }
    } catch (error) {
      toast.error('Login failed. Something went wrong.');
      console.log(error);
    }
  };

  const onSubmitRegister = async (data) => {
    try {
      const response = await userSignUp(data);
      console.log(response);

      if (response.success) {
        toast.success('Welcome to Chewse!');
        navigate('/user');
      } else {
        toast.error('Signup failed. Please check your credentials.');
      }
    } catch (error) {
      toast.error('Signup failed. Something went wrong.');
      console.log(error);
    }
  };

  return (
    <div className="container">
      {!isRegistering ? (
        <div className="Form login-form">
          <form onSubmit={loginForm.handleSubmit(onSubmitLogin)}>
            <div className="input-box">
              <i className="bx bxs-envelope"></i>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                {...loginForm.register("email", { required: "Email is required" })}
                placeholder="Enter Your Email*"
              />
              {loginForm.formState.errors.email && <p>{loginForm.formState.errors.email.message}</p>}
            </div>
            <div className="input-box">
              <i className="bx bxs-lock-alt"></i>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                {...loginForm.register("password", { required: "Password is required" })}
                placeholder="Enter Your Password*"
              />
              {loginForm.formState.errors.password && <p>{loginForm.formState.errors.password.message}</p>}
            </div>
            <div className="forgot-section">
              <span>
                <input type="checkbox" /> Remember Me
              </span>
              <span>
                <a href="#">Forgot Password?</a>
              </span>
            </div>
            <div className="flex items-center justify-center pt-[2rem]">
              <button type="submit" className="px-[2rem] py-[.5rem] rounded-lg bg-tradewind text-lg">Login</button>
            </div>
          </form>
          <p className="RegisterBtn" onClick={handleRegisterClick}>
            <a href="#">Register Now</a>
          </p>
        </div>
      ) : (
        <div className="Form register-form">
          <form onSubmit={signupForm.handleSubmit(onSubmitRegister)}>
            <div className="input-box">
              <i className="bx bxs-envelope"></i>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                {...signupForm.register("email", { required: "Email is required" })}
                placeholder="Enter Your Email*"
              />
              {signupForm.formState.errors.email && <p>{signupForm.formState.errors.email.message}</p>}
            </div>
            <div className="input-box">
              <i className="bx bxs-lock-alt"></i>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                {...signupForm.register("password", { required: "Password is required" })}
                placeholder="Enter Your Password*"
              />
              {signupForm.formState.errors.password && <p>{signupForm.formState.errors.password.message}</p>}
            </div>
            <div className="input-box">
              <i className="bx bxs-lock-alt"></i>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                {...signupForm.register("confirmPassword", { required: "Please confirm your password" })}
                placeholder="Confirm Your Password*"
              />
              {signupForm.formState.errors.confirmPassword && <p>{signupForm.formState.errors.confirmPassword.message}</p>}
            </div>
            <div className="forgot-section">
              <span>
                <input type="checkbox" /> Remember Me
              </span>
              <span>
                <a href="#">Forgot Password?</a>
              </span>
            </div>
            <div className="flex items-center justify-center pt-[2rem]">
              <button type="submit" className="px-[2rem] py-[.5rem] rounded-lg bg-tradewind text-lg">Register</button>
            </div>
          </form>
          <p className="LoginBtn" onClick={handleLoginClick}>
            <a href="#">Login Now</a>
          </p>
        </div>
      )}
    </div>
  );
};
