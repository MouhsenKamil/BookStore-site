import { HtmlHTMLAttributes, useEffect, useRef, useState } from 'react'

import './ThreeDotsOptionsBtn.css'


type ThreeDotsOptionsBtnProps = HtmlHTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode[]
}


type ThreeDotsOptionsItemProps = HtmlHTMLAttributes<HTMLDivElement> & {
  key: string | number
  children: string
}


export function ThreeDotsOptionsItem(props: ThreeDotsOptionsItemProps) {
  const { className, children, key, ...otherProps } = props

  return <div
    key={key}
    className={"three-dots-option-btn option " + (className || '')} {...otherProps}
  >
    {children}
  </div>
}


export function ThreeDotsOptionsBtn(props: ThreeDotsOptionsBtnProps) {
  const { children = [], ...otherProps } = props
  const optionsRef = useRef<HTMLDivElement>(null)
  const [showOptions, setShowOptions] = useState(false)

  useEffect(() => {
    function closeProfileDropdownAtOutsideClick(e: MouseEvent) {
      if (
        showOptions
        && optionsRef.current
        && !optionsRef.current?.contains(e.target as Node)
      )
        setShowOptions(false)
    }

    document.addEventListener('mousedown', closeProfileDropdownAtOutsideClick)

    return () => {
      document.removeEventListener('mousedown', closeProfileDropdownAtOutsideClick)
    }
  })

  return (
    <div className="three-dots-option-btn container" {...otherProps} ref={optionsRef}>
      <ul className="three-dots-option-btn icon" onClick={() => setShowOptions(!showOptions)}>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      {children}
    </div>
  )
}