import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<any>(null);

  useEffect(() => {
    const fetchBook = async () => {
      const response = await axios.get(`/api/books/${id}`);
      setBook(response.data);
    };
    fetchBook();
  }, [id]);

  if (!book) return <div>Loading...</div>;

  return (
    <div>
      <h2>{book.title}</h2>
      <img src={book.coverImage} alt={book.title} />
      <p>{book.author}</p>
      <p>{book.description}</p>
      <p>${book.price.toFixed(2)}</p>
      {/* Add to cart button and other actions can be added here */}
    </div>
  );
};
