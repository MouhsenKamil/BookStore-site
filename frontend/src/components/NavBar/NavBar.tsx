import { Link, useNavigate,  } from 'react-router-dom'
import axios from 'axios'

import { SearchBar } from '../SearchBar/SearchBar'

import { useAuth } from '../../hooks/useAuth'

import './NavBar.css'


export default function NavBar() {
  const auth = useAuth()
  const navigate = useNavigate()

  return (
    <div className='navbar'>
      <img
        className='img-icon site-navbar-logo'
        src="src/assets/bookstore-navbar-logo.png"
        alt="Bookstore site"
        onClick={() => navigate('/')}
      />
      <SearchBar />
      {auth.user !== null
        ? <img
            className='img-icon user-profile-icon'
            src="src/assets/user-profile-icon.png"
            alt="User"
            onClick={async () => {
              await axios.post('/api/auth/logout')
              navigate('/')
            }}
          />
        : <button>
          <Link to="/account/login">Login / Register</Link>
        </button>
      }
    </div>
  )
}
