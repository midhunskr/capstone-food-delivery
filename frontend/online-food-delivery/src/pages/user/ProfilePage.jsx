import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userLogout } from '../../services/userApi'
import toast from 'react-hot-toast'
import { axiosInstance } from '../../config/axioInstance'

export const ProfilePage = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    

    const handleLogout = async () => {
        const response = await userLogout()
        if (response?.success) {
            navigate('/')
        }
    }

    const fetchUserProfile = async () => {
        try {
            const response = await axiosInstance({
                url: '/user/profile',
                method: 'GET',
                withCredentials: true
            })
            setUser(response?.data)
            // return response?.data
            
        } catch (error) {
            console.log(error, 'Error fetching user data');
            toast.error('Error fetching user data')
        }
    }

    useEffect(() => {
        fetchUserProfile()
    }, [])

  return (
    <>
        <h1>Welcome, {user ? user.name : 'loading...'}</h1>
        <p className='text-bg-white'>Email: {user ? user.email : 'loading...'}</p>
        <div className='flex flex-row items-center '>
            <button className='btn btn-sm w-[8rem]'>Edit Profile</button>
            <button onClick={handleLogout} className='cursor-pointer btn btn-sm w-[8rem]'>
                Logout
            </button>
        </div>
    </>
  )
}
