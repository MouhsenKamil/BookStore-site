import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

import { SearchBar } from '../SearchBar/SearchBar'
import { useAuth } from '../../hooks/useAuth'

import './NavBar.css'


export default function NavBar() {
  const { user } = useAuth().authState
  const navigate = useNavigate()

  return (
    <div className='navbar'>
      <img
        className='img-icon site-navbar-logo'
        src="src/assets/bookstore-navbar-logo.png"
        alt="Bookstore site"
        onClick={() => navigate('/')}
      />
      {(!user || user.type === 'customer') && <SearchBar />}
      {(user !== null)
        ? <img
            className='img-icon user-profile-icon'
            src="src/assets/user-profile-icon.png"
            alt="User"
            onClick={async () => {
              const response = await axios.post('/api/auth/logout')
              if (response.status === 200)
                navigate(response.data.url)
            }}
          />
        : <button>
          <Link to="/account/user/login">Login / Register</Link>
        </button>
      }
    </div>
  )
}
