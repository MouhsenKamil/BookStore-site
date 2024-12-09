import React, { HtmlHTMLAttributes, JSXElementConstructor, useEffect, useRef, useState } from 'react'

import './ThreeDotsOptionsBtn.css'


type ThreeDotsOptionsBtnProps = HtmlHTMLAttributes<HTMLDivElement> & {
  children: React.ReactElement[]
}


export function ThreeDotsOptionsBtn(props: ThreeDotsOptionsBtnProps) {
  const { children = [], ...otherParentProps } = props
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
    <div className="three-dots-option-btn container" {...otherParentProps} ref={optionsRef}>
      <ul className="three-dots-option-btn icon" onClick={() => setShowOptions(!showOptions)}>
        <li></li>
        <li></li>
        <li></li>
      </ul>

      {showOptions && <div className="three-dots-option-btn options">{
        (children.map((child, key) => {
          return (
            <div key={key} className={"three-dots-option-btn option"} onClick={async (e) => {
              child?.props.onClick(e)
              setShowOptions(false)
            }}>
              {child}
            </div>
          )}))
      }</div>}
    </div>
  )
}
