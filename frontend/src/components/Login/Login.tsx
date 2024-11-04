import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'

import './Login.css'


interface LoginFormInputs {
  email: string
  password: string
}

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>()

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await axios.post('/api/auth/login', data)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <>
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <div className='form-heading'>Log in to Bookstore</div>
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

        <Link to='/forgot-password'>Forgot Password?</Link>

        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a href="/register">Register</a></p>
    </>
  )
}
