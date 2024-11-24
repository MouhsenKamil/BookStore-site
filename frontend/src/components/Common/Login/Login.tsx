import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { AxiosError } from 'axios'

import { toTitleCase } from '../../../utils/stringUtils'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import { LoginFormInputs, UserType } from '../../../types/auth'
import { loginUser } from '../../../services/authServices'

import './Login.css'


export default function Login(props: { parent: Exclude<UserType, 'customer'> }) {
  const { authState, fetchAuthData } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (authState.user)
      navigate('/')
  }, [])

  const [loginErr, setLoginErr] = useState('')

  const [UrlSearchParams, _] = useSearchParams({ from: '', msg: '' })

  const { parent: parentEndpoint } = props
  const { register, handleSubmit, formState: { errors }} = useForm<LoginFormInputs>()

  const onSubmit = async (data: LoginFormInputs) => {
    setLoginErr("")

    try {
      const response = await loginUser(data, { userType: parentEndpoint })

      if (response.status >= 400) {
        setLoginErr(response.data.error)
        return
      }
  
      fetchAuthData()

      // let uri = Object.fromEntries(new URLSearchParams(decodeURI(location.search)))
      // let redirectTo = uri.from || response.data.url || '/'
      let redirectTo = UrlSearchParams.get('from') || response.data.url || '/'
      console.log('redirectTo', redirectTo)

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
            (parentEndpoint === 'user') ? 'to Bookstore': ' as ' + toTitleCase(parentEndpoint)
          }
        </div>
        {UrlSearchParams.get('msg') && <div>{UrlSearchParams.get('msg')}</div>}
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
