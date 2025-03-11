import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import '../styles/book.css';

const AddBook = () => {
  const dispatch = useDispatch();
  const [book, setBook] = useState({
    title: '',
    author: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/books', book);
      dispatch({ type: 'ADD_BOOK', payload: response.data });
      // Clear form
      setBook({ title: '', author: '', content: '' });
      // Show success message or redirect
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-book-container">
      <h2>Add New Book</h2>
      <form onSubmit={handleSubmit} className="add-book-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={book.title}
            onChange={(e) => setBook(prev => ({ ...prev, title: e.target.value }))}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="author">Author</label>
          <input
            type="text"
            id="author"
            value={book.author}
            onChange={(e) => setBook(prev => ({ ...prev, author: e.target.value }))}
            required
            className="form-control"
          />
        </div>


        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={book.content}
            onChange={(e) => setBook(prev => ({ ...prev, content: e.target.value }))}
            required
            className="form-control"
            rows={6}
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Adding Book...' : 'Add Book'}
        </button>
      </form>
    </div>
  );
};

export default AddBook;
