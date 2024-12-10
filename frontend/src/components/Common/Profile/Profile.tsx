import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

import { useAuth } from '../../../hooks/useAuth'
import { IExtendedUser } from '../../../types/user'
import { toTitleCase } from '../../../utils/stringUtils'

import './Profile.css'


export default function Profile() {
  const { user } = useAuth().authState
  const [userObj, setUserObj] = useState<IExtendedUser>({} as IExtendedUser)

  async function fetchProfile() {
    try {
      const response = await axios.get(`/api/${user?.type}/@me`)
      if (response.status !== 200)
        throw new Error(response.statusText)

      setUserObj(response.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1 className='profile-heading'>{userObj.name}</h1>
        <p><strong>{toTitleCase(user?.type || '---')}</strong></p>
      </div>
      {
        Object.entries(userObj).map(([key, value]) => {
          if (['type', 'name', 'blocked'].includes(key))
            return

          if ((value instanceof Object) && Object.keys(value).length === 0)
            return

          return (
            <p>
              <label><strong>{toTitleCase(key.replace(/[A-Z]/g, letter => ` ${letter}`))}: </strong></label>
              <span>{(typeof value === "string") ? value: value.toString()}</span>
            </p>
          )
        })
      }
      <Link to='/user/cart'>My Cart</Link>
      <br />
      <Link to='/user/wishlist'>My Wishlist</Link>
      <br />
      <Link to='/user/orders'>My Orders</Link>
    </div>
  )
}
