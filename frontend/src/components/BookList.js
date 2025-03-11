import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBooks } from '../redux/slices/bookSlice';
import axios from 'axios';
import { format } from 'date-fns';
import BookCard from './BookCard';

const BookList = () => {
  const dispatch = useDispatch();
  const { items: books, status, error } = useSelector((state) => state.books);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBooks());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container">
      <h1 className="text-center">📚 Book Library (LIFO Order)</h1>
      <div className="books-grid">
        {[...books].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </div>
  );
};


export default BookList;
