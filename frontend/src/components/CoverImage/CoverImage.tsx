import React from "react"


export default function CoverImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img className="book-cover-image" {...props} onError={(e) => {
    e.currentTarget.onerror = null
    e.currentTarget.src = 'src/assets/cover-image-placeholder.png'
  }}/>
}
