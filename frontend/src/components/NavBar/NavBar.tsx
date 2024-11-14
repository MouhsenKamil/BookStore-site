import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

import { SearchBar } from '../SearchBar/SearchBar'
import { useAuth } from '../../hooks/useAuth'

import './NavBar.css'


export default function NavBar() {
  const { user } = useAuth().authState
  const navigate = useNavigate()

  useEffect(() => {
    console.log('from navbar', JSON.stringify(user))
  }, [])

  function ProfilePic() {
    return (
      <img
        className='img-icon user-profile-icon'
        src="src/assets/user-profile-icon.png"
        alt="User"
        onClick={async () => {
          const response = await axios.post('/api/auth/logout')
          if (response.status === 200)
            navigate(response.data.url)
        }}
      />
    )
  }

  return (
    <div className='navbar'>
      <img
        className='img-icon site-navbar-logo'
        src="src/assets/bookstore-navbar-logo.png"
        alt="Bookstore site"
        onClick={() => navigate('/')}
      />
      {(!user || user.type === 'customer') && <SearchBar />}
      {(!user || user.type === 'customer') && <SearchBar />}
      {(user !== null)
        ? <ProfilePic />
        : <button>
          <Link to="/account/user/login">Login / Register</Link>
        </button>
      }
    </div>
  )
}
