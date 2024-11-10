import { Link, redirect } from 'react-router-dom'
import axios from 'axios'

import { SearchBar } from '../SearchBar/SearchBar'

import { useAuth } from '../../hooks/useAuth'

import './NavBar.css'


export default function NavBar() {
  const auth = useAuth()

  return (
    <div className='navbar'>
      <img
        className='img-icon site-navbar-logo'
        src="src/assets/bookstore-navbar-logo.png"
        alt="Bookstore site"
        onClick={() => redirect('/')}
      />
      <SearchBar />
      {auth.user !== null
        ? <img
            className='img-icon user-profile-icon'
            src="src/assets/user-profile-icon.png"
            alt="User"
            onClick={async () => {
              await axios.post('/api/auth/logout')
              redirect('/')
            }}
          />
        : <Link to="/login">Login / Register</Link>
      }
    </div>
  )
}
