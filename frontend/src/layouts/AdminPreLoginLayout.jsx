import React from 'react'
import { Outlet } from 'react-router-dom'
import { AdminPreLoginHeader } from '../components/admin/AdminPreLoginHeader'
import { AdminFooter } from '../components/admin/AdminFooter'


export const AdminPreLoginLayout = () => {
    return (
      <div>
  
          <AdminPreLoginHeader/>
          <Outlet/>
          <AdminFooter/>
  
      </div>
    )
  }