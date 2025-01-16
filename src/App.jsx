import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './pages/Home'
import { ToastContainer, toast } from 'react-toastify';
function App() {
  return (
    <>
      <Header />
      <Outlet />
      <ToastContainer />
      {/* <CreateEvent /> */}
    </>
  )
}

export default App