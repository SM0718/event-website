import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './pages/Home'
function App() {
  return (
    <>
      <Header />
      <Outlet />
      <ToastContainer />
    </>
  )
}

export default App