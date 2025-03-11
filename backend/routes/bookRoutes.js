const express = require('express');
const router = express.Router();
const Book = require('../models/bookModel');
const jwt = require('jsonwebtoken');

// Middleware to authenticate user
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Please authenticate' });
    }
};

// Get all books
router.get('/', async (req, res) => {
    try {
        const books = await Book.find().populate('user', 'username');
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a book
router.post('/', auth, async (req, res) => {
    try {
        const book = await Book.create({
            ...req.body,
            user: req.userId
        });
        await book.populate('user', 'username');
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a book
router.put('/:id', auth, async (req, res) => {
    try {
        const book = await Book.findOne({ _id: req.params.id, user: req.userId });
        if (!book) {
            return res.status(404).json({ message: 'Book not found or unauthorized' });
        }
        Object.assign(book, req.body);
        await book.save();
        await book.populate('user', 'username');
        res.json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a book
router.delete('/:id', auth, async (req, res) => {
    try {
        const book = await Book.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!book) {
            return res.status(404).json({ message: 'Book not found or unauthorized' });
        }
        res.json({ message: 'Book deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
