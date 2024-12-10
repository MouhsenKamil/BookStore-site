import React, { useState } from "react"


interface IntInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  min: number
  max: number
  text: string
  onValChange: (val: number) => void
}


export default function IntInput(props: IntInputProps) {
  const { min, max, text, onValChange, ...otherProps } = props

  const [value, setValue] = useState<number>(min)
  const [error, setError] = useState<string | null>(null)

  // const handleSubmit = () => {
  //   const intValue = value

  //   if (isNaN(intValue)) {
  //     setError("Please enter a valid integer.")
  //     setValue(min)
  //   }

  //   else if (intValue < min) {
  //     setError(`Value must be greater than or equal to ${min}.`)
  //     setValue(min)
  //   }

  //   else
  //     setError(null)
  // }

  return (
    <div className='intinput-tag'>
      <label>
        {text}
        <input {...otherProps} type="text" value={value}
          onChange={(e) => {
            const num = +e.target.value
            if (!isNaN(num))
              setValue(num)

            if (num > max) {
              setError(`Value must be less than or equal to ${max}.`)
              setValue(max)
            }

            else if (error)
              setError(null)

            if (onValChange) onValChange(num)
          }}
        />
      </label>
      {error && <p className="error-item">{error}</p>}
    </div>
  )
}
