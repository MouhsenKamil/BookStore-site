// import React, { useState, useEffect } from 'react'
// import axios from 'axios'

// import { IBook } from '../../types/book.tsx'
// import BookCard from '../BookCard/BookCard.tsx'

import { SearchBar } from '../SearchBar/SearchBar.tsx'

import './Home.css'


export default function Home() {
  return (
    <div className="home-page">
      <div className='heading'>Welcome to the Book Store</div>
      <SearchBar />
    </div>
  )
}
