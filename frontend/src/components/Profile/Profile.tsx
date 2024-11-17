import { useEffect, useState } from 'react'
import axios from 'axios'

import { useAuth } from '../../hooks/useAuth'
import { IExtendedUser } from '../../types/user'
import { toTitleCase } from '../../utils/stringUtils'

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
    <div className="seller-profile">
      <div className="form-heading">{userObj.name}</div>
      <p>{toTitleCase(user?.type || '---')}</p>
      {
        Object.entries(userObj).map(([key, value]) => {
          return (
            <p>
              <label>{key.replace(/[A-Z]/g, letter => ` ${letter.toLowerCase()}`)}: </label>
              <span>{value}</span>
            </p>
          )
        })
      }
    </div>
  )
}
