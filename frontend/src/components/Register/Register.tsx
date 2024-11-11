import { useForm, SubmitHandler } from 'react-hook-form'
import axios from 'axios'

import './Register.css'
import { useState } from 'react'


interface RegisterFormInputs {
  name: string
  email: string
  password: string
  confirmPassword: string
  type: 'customer' | 'seller'
}

const passwordValidationFuncs: { [key: string]:[ (val: string) => boolean, string] } = {
  minLength: [(val) => val.length >= 8, 'Password must be at least 8 characters long'],
  hasAnUpperCaseLetter: [(val) => /[A-Z]/.test(val), 'Password must contain at least one uppercase letter'],
  hasALowerCaseLetter: [(val) => /[a-z]/.test(val), 'Password must contain at least one uppercase letter'],
  hasANumber: [(val) => /[0-9]/.test(val), 'Password must contain at least one number'],
  hasASpecialChar: [(val) => /[~`!@#$%^&*(){}[\];:"\",.<>\/?_+=-]/.test(val), 'Password must contain at least one special character']
}

export default function Register(props: { parent: 'user' | 'seller' }) {
  const { parent: parentEndpoint } = props
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormInputs>()
  const [registrationError, setRegistrationError] = useState<string>('')

  // Watch password field to compare it with confirmPassword
  const password = watch('password', '')

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    try {
      const registerRes = await axios.post('/api/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        type: parentEndpoint === 'user' ? 'customer': 'seller'
      })

      console.log(registerRes.data)
    } catch (err) {
      setRegistrationError((err as Error).message)
    }
  }

  return (
    <>
      <form className='register-form' onSubmit={handleSubmit(onSubmit)}>
        <div className='form-heading'>Create an account</div>
        <input
          type="text"
          placeholder="Name"
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && <p className='error-msg'>{errors.name.message}</p>}

        <input
          type="email"
          placeholder="Email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address',
            },
          })}
        />
        {errors.email && <p className='error-msg'>{errors.email.message}</p>}

        <input
          type="password"
          placeholder="Password"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters long',
            },
            // validate: {
            //   minLength: (val) => val.length >= 8 || 'Password must be at least 8 characters long',
            //   hasAnUpperCaseLetter: (val) => val.match(/[A-Z]/) || 'Password must contain at least one uppercase letter',
            //   hasALowerCaseLetter: (val) => val.match(/[a-z]/) || 'Password must contain at least one uppercase letter',
            //   hasANumber: (val) => val.match(/[0-9]/) || 'Password must contain at least one number',
            //   hasASpecialChar: (val) => val.match(new RegExp('[~`!@#$%^&*(){}[];:"\",.<>/?_+=-]')) || 'assword must contain at least one special character'
            // },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
              message: 'Password is in invalid format'
            }
          })}
        />
        {errors.password && <ul className='error-msg'>{(
          Object.values(passwordValidationFuncs).map(([validateFunc, errormsg], key) => {
            let checkRes = validateFunc(password)
            let msgTagClassName = checkRes ? "pass-item": "error-item"
            return <li key={key} className={msgTagClassName}>{errormsg}</li>
          }))}</ul>
        }

        <input
          type="password"
          placeholder="Confirm Password"
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          })}
        />
        {errors.confirmPassword && password && !errors.password && (
          <p className='error-msg'>{errors.confirmPassword.message}</p>
        )}

        {/* <div className='account-type'>
          <b>Are you a:</b>
          <label>
            <input type="radio" id="rb-customer" value='customer' {...register('type', { required: true })} checked />
            Customer
          </label>
          /
          <label>
            <input type="radio" id="rb-seller" value='seller' {...register('type', { required: true })} />
            Seller
          </label>
        </div> */}

        <button type="submit">Register</button>
        <p className='registration-err'>{registrationError}</p>
      </form>
      <p>Already have an account? <a href={`/accounts/${parentEndpoint}/login`}>Login</a></p>
    </>
  )
}
