import { Link, redirect } from 'react-router-dom'

import { SearchBar } from '../SearchBar/SearchBar'

import { useAuth } from '../../hooks/useAuth'

import './NavBar.css'

export default function NavBar() {
  const auth = useAuth()

  return (
    <div className='navbar'>
      <img
        className='site-navbar-logo'
        src="src/assets/bookstore-navbar-logo.png"
        alt="Bookstore site"
        onClick={() => redirect('/')}
      />
      <SearchBar />
      {auth
        ? <img className='user-profile-icon' src="src/assets/user-profile-icon.png" alt="User" />
        : <Link to="/login">Login / Register</Link>
      }
    </div>
  )
}
