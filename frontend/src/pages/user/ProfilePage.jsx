import PropTypes from "prop-types";
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

    const [activeIndex, setActiveIndex] = useState(0);

    const sections = [
        { name: 'Orders', content: 'Content for section 1' },
        { name: 'Payments', content: 'Content for section 2' },
        { name: 'Addresses', content: 'Content for section 3' },
    ];
    return (
        <div>
            <div className="self-stretch flex flex-col items-center bg-bg-white text-dark justify-center py-[2rem] px-[1.25rem] pb-[2rem] box-border max-w-full text-left text-[1.5rem] font-montserrat">
                <div className="h-full w-[70.5rem] flex flex-col items-start justify-start pt-[0rem] px-[0rem] pb-[0rem] box-border gap-[2.012rem] max-w-full mq450:h-auto mq750:gap-[1rem] mq750:pb-[11.688rem] mq750:box-border">
                    <div className="self-stretch flex flex-col items-start justify-start py-[0rem] pl-[0.5rem] pr-[0rem] box-border shrink-0 max-w-full gap-[1.25rem] mq450:flex-wrap">
                        <h1 className="m-0 w-[22.75rem] relative text-inherit text-dark leading-[121.88%] font-bold font-[inherit] inline-block shrink-0 max-w-full mq450:text-[1.188rem] mq450:leading-[1.438rem] items-start justify-start">Hi, {user ? user.name + "!" : 'loading...'}</h1>
                    </div>
                    <div>
                        <div className="flex">
                            {/* Left Side Menu */}
                            <div className="w-6/12 bg-gray-200 border-r border-gray-300">
                                <ul className="space-y-2 p-4">
                                    {sections.map((section, index) => (
                                        <li
                                            key={index}
                                            className={`cursor-pointer p-2 rounded-md ${activeIndex === index ? 'bg-blue-500 text-white' : 'hover:bg-gray-300'
                                                }`}
                                            onClick={() => setActiveIndex(index)}
                                        >
                                            {section.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Right Side Content */}
                            <div className="w-9/12 p-4">
                                <div>
                                    <b>Recent orders</b>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

ProfilePage.propTypes = {
    className: PropTypes.string,
};