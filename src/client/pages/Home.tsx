import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookCard from '../components/BookCard';

interface Book {
  _id: string;
  title: string;
  author: string;
  price: number;
  coverImage: string;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch all books initially
    fetchBooks();
  }, []);

  // Function to fetch books
  const fetchBooks = async (query: string = '') => {
    if (!query) {
      setBooks([])
      return
    }
  
    try {
      const response = await axios.get(`/api/books?search=${query}`);
      setBooks(response.data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    }
  }

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchBooks(value);
  };

  // Handle adding to cart
  const handleAddToCart = (book: Book) => {
    // Implement your add to cart logic here
    console.log(`Added to cart: ${book.title}`);
  };

  // Handle buying book
  const handleBuy = (book: Book) => {
    // Implement your buy logic here
    console.log(`Bought: ${book.title}`);
  };

  return (
    <div className="home-page">
      <div className="navbar">
        <a href="/">Home</a>
        <a href="/login">Login</a>
        <a href="/register">Register</a>
      </div>
      <h1>Welcome to the Book Store</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for books..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="book-list">
        {books.map((book) => (
          <BookCard
            key={book._id}
            book={book}
            onAddToCart={() => handleAddToCart(book)}
            onBuy={() => handleBuy(book)}
          />
        ))}
      </div>
    </div>
  );
};
