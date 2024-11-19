import { Link, Outlet } from 'react-router-dom'

import NavBar from '../Common/NavBar/NavBar.tsx'

import { useAuth } from '../../hooks/useAuth.tsx'

import './App.css'


export default function App() {
  const { user } = useAuth().authState

  return (
    <>
      <NavBar />
      <div className="main">
        <Outlet />
      </div>
      <footer>
        <div className='other-hyperlinks'>
          {
            (!user || user.type === 'customer') &&
              <span><Link to='/account/seller/register'>Become a Seller</Link></span>
          }
          <span><Link to='/about-us'>About us</Link></span>
          <span><Link to='/contact-us'>Contact us</Link></span>
        </div>
        <p>&copy; {new Date().getFullYear()} Bookstore Ltd. All rights reserved.</p>
      </footer>
    </>
  )
}
