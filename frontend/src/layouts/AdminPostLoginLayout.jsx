import React from 'react'
import { Outlet } from 'react-router-dom'
import { AdminFooter } from '../components/admin/AdminFooter'
import { AdminPostLoginHeader } from '../components/admin/AdminPostLoginHeader'


export const AdminPostLoginLayout = () => {
    return (
      <div>
  
          <AdminPostLoginHeader/>
          <Outlet/>
          <AdminFooter/>
  
      </div>
    )
  }