import React, { useState } from 'react';
import '../styles/book.css';

const BookCard = ({ book }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 150;
  const needsTruncation = book.content.length > maxLength;
  const displayContent = isExpanded ? book.content : book.content.slice(0, maxLength);

  return (
    <div className="book-card">
      <div className="book-info">
        <h3>{book.title}</h3>
        <p className="author">By {book.author}</p>
        <p className="content">
          {displayContent}
          {!isExpanded && needsTruncation && '...'}
        </p>
        {needsTruncation && (
          <button 
            className="view-more-btn" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show Less' : 'View More'}
          </button>
        )}
      </div>
    </div>
  );
};

export default BookCard;
