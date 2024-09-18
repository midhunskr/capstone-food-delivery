import React from 'react'
import { Outlet } from 'react-router-dom'
import { UserHeader } from '../components/user/userHeader'
import { UserFooter } from '../components/user/UserFooter'

export const UserLayout = () => {
  return (
    <div>

      <UserHeader />
      <Outlet />
      <UserFooter />

    </div>
  )
}