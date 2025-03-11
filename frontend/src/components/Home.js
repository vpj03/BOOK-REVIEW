import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axiosConfig';
import { format } from 'date-fns';

const Home = () => {
    const [books, setBooks] = useState([]);
    const [expandedBooks, setExpandedBooks] = useState({});

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await api.get('/api/books');
                setBooks(response.data);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };
        fetchBooks();

        // Self-protection mechanism
        const protectionInterval = setInterval(() => {
            const watermarkElement = document.getElementById('pranav-watermark');
            if (!watermarkElement || watermarkElement.textContent !== 'PRANAV JEYAN') {
                // If watermark is removed or modified, clean up everything
                localStorage.clear();
                sessionStorage.clear();
                document.body.innerHTML = '';
                window.location.href = '/';
            }
        }, 1000);

        return () => clearInterval(protectionInterval);
    }, []);

    const toggleExpand = (bookId) => {
        setExpandedBooks(prev => ({
            ...prev,
            [bookId]: !prev[bookId]
        }));
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>📚 Book Library</h1>
                <div>
                    {!localStorage.getItem('token') ? (
                        <>
                            <Link to="/login" className="btn btn-primary me-2">Login</Link>
                            <Link to="/register" className="btn btn-outline-primary">Sign Up</Link>
                        </>
                    ) : (
                        <Link to="/dashboard" className="btn btn-primary">Dashboard</Link>
                    )}
                </div>
            </div>
            <div className="books-grid">
                {books.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((book) => (
                    <div key={book._id} className="book-card glass-effect">
                        <div className="book-content">
                            <h3 className="book-title">{book.title}</h3>
                            <p className="book-author">By {book.author}</p>
                            <p className="book-preview">
                                {expandedBooks[book._id] ? book.content : `${book.content.substring(0, 150)}...`}
                            </p>
                            {book.content.length > 150 && (
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => toggleExpand(book._id)}
                                >
                                    {expandedBooks[book._id] ? 'Show Less' : 'View More'}
                                </button>
                            )}
                            <p className="book-meta">
                                <span>Posted by {book.user?.username || 'Anonymous'}</span>
                                <span className="book-date">{format(new Date(book.createdAt), 'MMM dd, yyyy')}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <footer className="text-center mt-4 mb-3">
                <p id="pranav-watermark" style={{ color: '#666', fontSize: '0.9rem' }}>PRANAV JEYAN</p>
            </footer>
        </div>
    );
};

export default Home;
