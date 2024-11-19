import { useForm, SubmitHandler } from 'react-hook-form'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios, { AxiosError } from 'axios'
import { useAuth } from '../../../hooks/useAuth'
import { RegisterFormInputs } from '../../../types/auth'

import './Register.css'


const passwordValidationFuncs: { [key: string]:[ (val: string) => boolean, string] } = {
  minLength: [val => val.length >= 8, 'Password must be at least 8 characters long'],
  hasAnUpperCaseLetter: [val => /[A-Z]/.test(val), 'Password must contain at least one uppercase letter'],
  hasALowerCaseLetter: [val => /[a-z]/.test(val), 'Password must contain at least one uppercase letter'],
  hasANumber: [val => /[0-9]/.test(val), 'Password must contain at least one number'],
  hasASpecialChar: [val => /[~`!@#$%^&*(){}[\];:"\",.<>\/?_+=-]/.test(val), 'Password must contain at least one special character']
}


export default function Register(props: { parent: 'user' | 'seller' }) {
  const { fetchAuthData } = useAuth()
  const { parent: parentEndpoint } = props
  const {
    register, handleSubmit, watch, formState: { errors }
  } = useForm<RegisterFormInputs>()
  const [registrationError, setRegistrationError] = useState<string>('')
  const navigate = useNavigate()
  const location = useLocation()

  // Watch password field to compare it with confirmPassword
  const password = watch('password', '')

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    try {
      let dataObj: Omit<RegisterFormInputs, 'confirmPassword'> = {
        name: data.name,
        email: data.email,
        password: data.password,
        type: parentEndpoint === 'user' ? 'customer': parentEndpoint
      }

      if (parentEndpoint === "seller") {
        dataObj = {
          ...dataObj,
          phoneNo: data.phoneNo,
          passportNumber: data.passportNumber,
        }
      }

      const response = await axios.post('/api/auth/register', dataObj)

      console.log(JSON.stringify(response))

      if (response.status !== 200) {
        setRegistrationError(response.data.error)
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

      setRegistrationError(msg)
    }
  }

  return (
    <>
      <form className='register-form' onSubmit={handleSubmit(onSubmit)}>
        <div className='form-heading'>{`Create ${(parentEndpoint === 'seller') ? 'a Seller': 'an'} account`}</div>
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
            validate: value => value === password || 'Passwords do not match',
          })}
        />
        {errors.confirmPassword && password && !errors.password && (
          <p className='error-msg'>{errors.confirmPassword.message}</p>
        )}

        {
          (parentEndpoint === 'seller') && <>
            <input type="tel" placeholder="Phone no."
              {...register(
                'phoneNo', {
                  required: 'Please enter your phone number',
                  pattern: {
                    value: /^[0-9]{2}[a-z]{3}[CPHFATBLJG]{1}[a-z]{1}[0-9]{4}[a-z]{1}[0-9a-z]{1}Z[0-9a-z]{1}$/,
                    message: 'Phone number is invalid'
                  }
                })}
            />
            {errors.phoneNo && <p className='error-msg'>{errors.phoneNo.message}</p>}

            <input type="string" placeholder="Passport no."
              {...register('passportNumber', {
                required: 'Please enter your passportNumber',
                pattern: {
                  value: /^[A-Z][1-9][0-9]\s?[0-9]{4}[1-9]$/,
                  message: 'Passport number number is invalid'
                }
              })}
            />
            {errors.passportNumber && <p className='error-msg'>{errors.passportNumber.message}</p>}
          </>
        }

        <button type="submit">Register</button>
        {registrationError && <p className='registration-err error-msg'>{registrationError}</p>}
      </form>
      <p>Already have an account? <a href={`/account/${parentEndpoint}/login`}>Login</a></p>
    </>
  )
}