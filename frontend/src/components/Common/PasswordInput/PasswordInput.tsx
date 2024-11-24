import { useState } from 'react'
import eyeClosed from './../../../assets/eye-closed.png'
import eyeOpened from './../../../assets/eye-opened.png'

import './PasswordInput.css'


export function PasswordInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...otherProps } = props
  const [viewPassword, setViewPassword] = useState(false)

  return (
    <div className={"password-input " + className}>
      <input type={viewPassword ? "text": "password"} {...otherProps} />
      <img id="password-input-eye-icon" src={
        viewPassword ? eyeOpened : eyeClosed
      }
      onClick={() => setViewPassword(!viewPassword)} />
    </div>
  )
}
