import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios, { AxiosError } from 'axios'

import { titleCase } from '../../utils/stringUtils'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

import './Login.css'


interface LoginFormInputs {
  email: string
  password: string
  type: 'customer' | 'seller' | 'admin'
}


export default function Login(props: { parent: 'user' | 'seller' | 'admin' }) {
  const [loginErr, setLoginErr] = useState('')
  const { fetchAuthData } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const { parent: parentEndpoint } = props
  const { register, handleSubmit, formState: { errors }} = useForm<LoginFormInputs>()

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      data.type = parentEndpoint === 'user' ? 'customer': parentEndpoint
      const response = await axios.post('/api/auth/login', data)

      console.log(JSON.stringify(response))

      if (response.status !== 200) {
        setLoginErr(response.data.error)
        return
      }
  
      fetchAuthData()

      let uri = Object.fromEntries(new URLSearchParams(decodeURI(location.search)))
      let redirectTo = uri.from || response.data.url || '/'

      navigate(redirectTo)
    } catch (err) {
      console.error(err)
      let msg = 'An error occured. Please try again.'

      if (err instanceof AxiosError)
        msg = err.response?.data.error
      else if (err instanceof Error)
        msg = err.message

      setLoginErr(msg)
    }
  }

  return (
    <>
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <div className='form-heading'>
          Login {
            (parentEndpoint === 'user') ? 'to Bookstore': ' as ' + titleCase(parentEndpoint)
          }
        </div>
        <input
          type="email"
          placeholder="Email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address'
            }
          })}
        />
        {errors.email && <p className='error-msg'>{errors.email.message}</p>}

        <input
          type="password"
          placeholder="Password"
          {...register('password', { required: 'Password is required' })}
        />
        {errors.password && <p className='error-msg'>{errors.password.message}</p>}
        {loginErr && <p className='login-err error-msg'>{loginErr}</p>}

        <Link to={`/account/${parentEndpoint}/forgot-password`}>Forgot Password?</Link>

        <button type="submit">Login</button>
      </form>
      <p>
        Don't have {(parentEndpoint === 'seller') ? 'a seller': 'an'} account?
        &nbsp;
        <Link to={`/account/${parentEndpoint}/register`}>Register</Link>
      </p>
    </>
  )
}
