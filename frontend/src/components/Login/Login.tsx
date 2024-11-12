import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios, { AxiosError } from 'axios'

import './Login.css'
import { titleCase } from '../../utils/stringUtils'
import { useState } from 'react'


interface LoginFormInputs {
  email: string
  password: string
  type: 'customer' | 'seller' | 'admin'
}


export default function Login(props: { parent: 'user' | 'seller' | 'admin' }) {
  const [loginErr, setLoginErr] = useState('')

  const { parent: parentEndpoint } = props
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>()

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      data.type = parentEndpoint === 'user' ? 'customer': parentEndpoint
      const response = await axios.post('/api/auth/login', data)
      if (response.status !== 308)
        setLoginErr(response.data)
  
    } catch (err) {
      console.error(err)
      setLoginErr((err as AxiosError).message)
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
