import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../../config/axioInstance'
import { useNavigate } from 'react-router-dom'

export const UserAuth = ({children}) => {
    const navigate = useNavigate()
    const [user, setUser] = useState()
  
    const checkUser = async() => {
        try {
            const response = await axiosInstance({
                url: '/user/check-user',
                method: 'GET',
                withCredentials: true
            })
            setUser(true)
            return response?.data
            
        } catch (error) {
            navigate('/')
            console.log(error)
        }
    }
  
    useEffect(()=> {
        checkUser()
    })
    return user ? children : null
}
