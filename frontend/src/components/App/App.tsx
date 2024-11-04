import { Outlet } from 'react-router-dom'

import NavBar from '../NavBar/NavBar.tsx'

import './App.css'


export default function App() {
  return (
    <>
      <NavBar />
      <div className="main">
        <Outlet />
      </div>
      <footer>
        <p>&copy; {new Date().getFullYear()} Bookstore Ltd. All rights reserved.</p>
      </footer>
    </>
  )
}
