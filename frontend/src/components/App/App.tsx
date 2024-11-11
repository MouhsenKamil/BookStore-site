import { Link, Outlet } from 'react-router-dom'

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
        <div className='other-hyperlinks'>
          <ul>
            <li><Link to='/account/seller/regiser'>Become a Seller</Link></li>
            <li><Link to='/about-us'>About us</Link></li>
            <li>Contact us</li>
          </ul>
        </div>
        <p>&copy; {new Date().getFullYear()} Bookstore Ltd. All rights reserved.</p>
      </footer>
    </>
  )
}
