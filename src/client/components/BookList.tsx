import React, { useEffect, useState } from 'react';
import BookCard from './BookCard';
import axios from 'axios';

export default function BookList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await axios.get('/api/books');
      setBooks(response.data);
    };
    fetchBooks();
  }, []);

  return (
    <div className="book-list">
      {books.map(book => (
        <BookCard key={book._id} book={book} />
      ))}
    </div>
  );
};
