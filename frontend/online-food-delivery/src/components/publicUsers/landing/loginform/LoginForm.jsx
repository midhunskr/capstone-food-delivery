// import React, { useState } from 'react';
// import './LoginForm.css'
// // import 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css'; // Ensure boxicons is installed via npm or linked properly

// export const LoginForm = () => {
//   const [isRegistering, setIsRegistering] = useState(false);

//   const handleRegisterClick = () => {
//     setIsRegistering(true);
//   };

//   const handleLoginClick = () => {
//     setIsRegistering(false);
//   };

//   return (
//     <div className="container">
//       <div className={`Form login-form ${isRegistering ? 'active' : ''}`}>
//         <h2>Login</h2>
//         <form action="#">
//           <div className="input-box">
//             <i className='bx bxs-user'></i>
//             <label htmlFor="#">Username</label>
//             <input type="text" placeholder="Enter Your Username*" />
//           </div>
//           <div className="input-box">
//             <i className='bx bxs-envelope'></i>
//             <input type="password" placeholder="Enter Your Password*" />
//             <label htmlFor="#">Password</label>
//           </div>
//           <div className="forgot-section">
//             <span>
//               <input type="checkbox" name="" id="checked" /> Remember Me
//             </span>
//             <span>
//               <a href="#">Forgot Password?</a>
//             </span>
//           </div>
//           <button className="btn">Login</button>
//         </form>
//         <p>Or Sign up using</p>
//         <div className="social-media">
//           <i className='bx bxl-facebook'></i>
//           <i className='bx bxl-google'></i>
//           <i className='bx bxl-twitter'></i>
//         </div>
//         <p className="RegisteBtn RegiBtn" onClick={handleRegisterClick}>
//           <a href="#">Register Now</a>
//         </p>
//       </div>

//       <div className={`Form Register-form ${isRegistering ? 'active' : ''}`}>
//         <h2>Register</h2>
//         <form action="#">
//           <div className="input-box">
//             <i className='bx bxs-user'></i>
//             <label htmlFor="#">Username</label>
//             <input type="text" placeholder="Enter Your Username*" />
//           </div>
//           <div className="input-box">
//             <i className='bx bxs-envelope'></i>
//             <input type="password" placeholder="Enter Your Password*" />
//             <label htmlFor="#">Password</label>
//           </div>
//           <div className="input-box">
//             <i className='bx bxs-envelope'></i>
//             <input type="password" placeholder="Confirm Your Password*" />
//             <label htmlFor="#">Confirm Password</label>
//           </div>
//           <div className="forgot-section">
//             <span>
//               <input type="checkbox" name="" id="checked" /> Remember Me
//             </span>
//             <span>
//               <a href="#">Forgot Password?</a>
//             </span>
//           </div>
//           <button className="btn">Register</button>
//         </form>
//         <p>Or Sign up using</p>
//         <div className="social-media">
//           <i className='bx bxl-facebook'></i>
//           <i className='bx bxl-google'></i>
//           <i className='bx bxl-twitter'></i>
//         </div>
//         <p className="LoginBtn" onClick={handleLoginClick}>
//           <a href="#">Login Now</a>
//         </p>
//       </div>
//     </div>
//   );
// };
