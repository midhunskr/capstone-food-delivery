import axios from "axios"
import toast from "react-hot-toast"
import { axiosInstance } from "../config/axioInstance"


export const userLogin = async(data)=>{
    try {
        const response = await axios({
            url: 'http://localhost:3000/api/v1/user/login',
            method: 'POST',
            data,
            withCredentials: true
        })
        
        return response?.data
    } catch (error) {
        console.log(error);        
    }
}

export const userLogout = async () => {
    try {
        const response = await axiosInstance({
            url: '/user/logout',
            method: 'POST',
            withCredentials: true
        })
        console.log(response);
        
        return response?.data
    } catch (error) {
        toast.error('Logout Failed')
        console.log(error);
        
    }
}

// export const fetchUserProfile = async () => {
//     try {
//         const response = await axiosInstance({
//             url: '/user/profile',
//             method: 'GET',
//             withCredentials: true
//         })

//         console.log(response, '==============response');
//         return response?.data
        
//     } catch (error) {
//         console.log('Error fetching user data');
//         toast.error('Error fetching user data')
//     }
// }