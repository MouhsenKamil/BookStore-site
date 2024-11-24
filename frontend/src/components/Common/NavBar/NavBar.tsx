import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

import { SearchBar } from '../SearchBar/SearchBar'
import { useAuth } from '../../../hooks/useAuth'
import { toTitleCase } from '../../../utils/stringUtils'

import './NavBar.css'


const roleBasedRoutesMap = {
  user: ['profile', 'cart', 'wishlist', 'orders'],
  seller: ['home', 'profile', 'add-a-book'],
  admin: ['home', 'customers', 'sellers', 'orders']
}


export default function NavBar() {
  const { authState, fetchAuthData } = useAuth()
  const { user } = authState
  const navigate = useNavigate()
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  function ProfilePic() {
    let userType: string | undefined = user?.type

    if (userType === undefined)
      return <></>

    if (userType === "customer")
      userType = "user"

    const userTypeRoutes = roleBasedRoutesMap[userType as 'user' | 'seller' | 'admin']

    return (
      <div className="user-icon">
        <img
          className='img-icon user-profile-icon' src="/api/static/user-profile-icon.png"
          alt="User" onClick={() => setShowProfileMenu(!showProfileMenu)}
        />
        <div className={`actions ${showProfileMenu ? 'show': ''}`}>
          <div className='username'>
            {user?.name} {user?.type === 'customer' ? '': `(${user?.type})`}
          </div>
          <hr />
          <div className="links" onClick={() => setShowProfileMenu(!showProfileMenu)}>{
            userTypeRoutes.map((endpoint, key) =>
                <Link key={key} to={`/${userType}/${endpoint}`}>{toTitleCase(endpoint.replace(/-/g, ' '))}</Link>
            )
          }</div>
          <button className='logout-btn' onClick={async () => {
            const response = await axios.post('/api/auth/logout', {}, { withCredentials: true })
            if (response.status !== 200) {
              alert(response.data.error)
              return
            }

            setShowProfileMenu(false)
            navigate(response.data.url)
            fetchAuthData()
          }}>Log Out</button>
        </div>
      </div>
    )
  }

  return (
    <div className='navbar'>
      <img
        className='img-icon site-navbar-logo'
        src="/api/static/bookstore-navbar-logo.png"
        alt="Bookstore site"
        onClick={() => navigate('/')}
      />
      {(!user || user.type === 'customer') && <SearchBar />}
      {(!!user)
        ? <ProfilePic />
        : <button className='login-btn'>
          <Link to="/account/user/login">Login</Link>
        </button>
      }
    </div>
  )
}
