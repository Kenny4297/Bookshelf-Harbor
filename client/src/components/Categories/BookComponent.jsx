import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import defaultImage from '../assets/images/defaultImage.jpg'

const BookComponent = ({ category }) => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`https://openlibrary.org/subjects/${category}.json?limit=10`);
        setBooks(response.data.works);
      } catch (error) {
        console.error(`Error fetching data for ${category}`, error);
      }
    };
    fetchBooks();
  }, [category]);

  return (
    <div className='book-container'>
      <h2>{category}</h2>
      <div className='books'>
        {books.map((book, index) => (
          <Link to={`/book-details/${book.cover_edition_key}`} className='book-card' key={index}>
            <img
              className='book-cover'
              src={book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg` : defaultImage}
              alt={`Cover for ${book.title}`}
            />
            <h3 className='book-title'>{book.title}</h3>
            <p className='book-author'>{book.authors && book.authors[0]?.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BookComponent;
