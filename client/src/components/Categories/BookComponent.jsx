import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import defaultImage from '../assets/images/defaultImage.jpg'

const BookComponent = ({ category }) => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`https://openlibrary.org/subjects/${category}.json?limit=10&offset=${page * 100}`);
        setBooks(response.data.works);
      } catch (error) {
        console.error(`Error fetching data for ${category}`, error);
      }
    };
    fetchBooks();
  }, [category, page]);

  return (
    <div className='book-container'>
      <h2 className='category'>{category}</h2>
      <div className='book-grid'>
        {books.map((book, index) => (
          <Link to={`/book-details/${book.cover_edition_key}`} className='book-card' key={index}>
            <div className='book-card-content'>
              <img
                className='book-card-image'
                src={book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg` : defaultImage}
                alt={`Cover for ${book.title}`}
              />
              <h3 className='book-card-title'>{book.title}</h3>
              <p className='book-card-author'>{book.authors && book.authors[0]?.name}</p>
            </div>
          </Link>
        ))}
      </div>
      <div>
        {page > 0 && 
          <button onClick={() => {
            setPage(page - 1);
            window.scrollTo(0, 0);
          }}>Previous Page</button>
        }
        <button onClick={() => {
            setPage(page + 1);
            window.scrollTo(0, 0);
          }}>Next Page</button>
      </div>
    </div>
  );

};

export default BookComponent;
