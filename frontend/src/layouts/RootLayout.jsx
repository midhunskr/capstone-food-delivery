import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '../components/publicUsers/Header'
import { Footer } from '../components/publicUsers/Footer'

export const RootLayout = () => {
  return (
    <div>

      <Header />
      <Outlet />
      <Footer />

    </div>
  )
}
