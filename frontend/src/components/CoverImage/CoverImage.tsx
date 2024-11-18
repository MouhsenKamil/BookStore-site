import React from "react"

import './CoverImage.css'


interface CoverImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  coverImg: string | null
}


export default function CoverImage(props: CoverImageProps) {
  const FALLBACK_BOOK_COVER_IMG_URL = "/cover-image-placeholder.png"
  const { coverImg, title, ...otherProps } = props

  return (
    <img
      className="book-cover-image"
      src={`/api/static${coverImg ?? FALLBACK_BOOK_COVER_IMG_URL}`}
      alt={props.alt ?? title ?? "Book Cover"}
      {...otherProps}
      onError={(e) => {
        if (e.currentTarget.src.endsWith(FALLBACK_BOOK_COVER_IMG_URL))
          return
        e.currentTarget.src = `/api/static${FALLBACK_BOOK_COVER_IMG_URL}`
      }}
    />
  )
}
