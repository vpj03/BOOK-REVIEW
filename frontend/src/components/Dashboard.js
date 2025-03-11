import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosConfig';

const Dashboard = () => {
    const [books, setBooks] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        content: ''
    });
    const [editingId, setEditingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
            return;
        }
        fetchUserBooks();
    }, [navigate]);

    const fetchUserBooks = async () => {
        try {
            const response = await api.get('/api/books', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setBooks(response.data.filter(book => book.user._id === localStorage.getItem('userId')));
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/api/books/${editingId}`, formData, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
            } else {
                await api.post('/api/books', formData, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
            }
            setFormData({ title: '', author: '', content: '' });
            setEditingId(null);
            fetchUserBooks();
        } catch (error) {
            console.error('Error saving book:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/api/books/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchUserBooks();
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    const handleEdit = (book) => {
        setFormData({ title: book.title, author: book.author, content: book.content });
        setEditingId(book._id);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/');
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>My Books</h1>
                <button onClick={handleLogout} className="btn btn-danger">Logout</button>
            </div>

            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Author"
                        value={formData.author}
                        onChange={(e) => setFormData({...formData, author: e.target.value})}
                        required
                    />
                </div>
                <div className="mb-3">
                    <textarea
                        className="form-control"
                        placeholder="Content"
                        value={formData.content}
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    {editingId ? 'Update Book' : 'Add Book'}
                </button>
            </form>

            <div className="row">
                {books.map((book) => (
                    <div key={book._id} className="col-md-4 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{book.title}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">By {book.author}</h6>
                                <p className="card-text">{book.content}</p>
                                <button
                                    onClick={() => handleEdit(book)}
                                    className="btn btn-sm btn-primary me-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(book._id)}
                                    className="btn btn-sm btn-danger"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
