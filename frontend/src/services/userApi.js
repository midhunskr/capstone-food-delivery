import toast from "react-hot-toast"
import { axiosInstance } from "../config/axioInstance"


export const userLogin = async(data)=>{
    try {
        const response = await axiosInstance({
            url: '/user/login',
            method: 'POST',
            data,
            withCredentials: true
        })
        console.log("response==============",response);
        
        return response?.data
    } catch (error) {
        console.log(error);        
    }
}

export const userSignUp = async(data)=>{
    try {
        const response = await axiosInstance({
            url: '/user/register',
            method: 'POST',
            data,
            withCredentials: true
        })
        console.log("=============response", response);
        
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

export const adminLogin = async(data)=>{
    try {
        const response = await axiosInstance({
            url: '/user/login',
            method: 'POST',
            data,
            withCredentials: true
        })        
        return response?.data
    } catch (error) {
        console.log(error);        
    }
}

export const adminSignUp = async(data)=>{
    try {
        const response = await axiosInstance({
            url: 'user/register',
            method: 'POST',
            data,
            withCredentials: true
        })      
        return response?.data
    } catch (error) {
        console.log(error);        
    }
}

export const adminLogout = async () => {
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