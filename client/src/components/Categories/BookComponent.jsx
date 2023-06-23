import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import defaultImage from '../assets/images/defaultImage.jpg'
import Loading from '../Loading'

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

  useEffect(() => {
    if (books) {
    console.log(books);
    }
  }, [books]);



return (
  <>
    {books.length === 0 ? (
      <Loading />
    ) : (
      <>
        <div className='book-container'>
          <h2 className='book-category-h2'>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
          <div className='book-grid'>
            {books.map((book, index) => (
              <Link to={`/books/works/${book.key.replace("/works/", "")}`} className='book-card' key={index}>
                <div className='book-card-content'>
                  <img
                    className='book-card-image'
                    src={book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg` : defaultImage}
                    alt={`Cover for ${book.title}`}
                  />
                  <h3 className='book-card-title' title={book.title}>{book.title}</h3>
                  <p className='book-card-author'>{book.authors && book.authors[0]?.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent:'center', border:'2px solid green', paddingBottom:'5rem'}}>   
            {page > 0 && 
              <button className="individual-book-button" onClick={() => {
                setPage(page - 1);
                window.scrollTo(0, 0);
              }}>Previous Page</button>
            }
            <p style={{ color: "var(--grey-wood)" }}>page: {page + 1}</p>

            <button className="individual-book-button" onClick={() => {
                setPage(page + 1);
                window.scrollTo(0, 0);
              }}>Next Page</button>
        </div>
      </>
    )}
  </>
);
            }



export default BookComponent;
