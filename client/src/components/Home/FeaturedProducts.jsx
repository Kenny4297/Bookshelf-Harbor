import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import loading from '../assets/gifs/loading.gif'

const FeaturedBooks = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        console.log("UseEffect is running!")
        fetchBooks(3);
    }, []);

    const fetchBooks = async (count) => {
        try {
            // Check if books are already stored in localStorage
            const storedBooks = localStorage.getItem('books');
            const storedDate = localStorage.getItem('booksDate');
            const currentDate = new Date().toISOString().split('T')[0]; // Get current date in "YYYY-MM-DD" format
    
            if (storedBooks && storedDate === currentDate) {
                setBooks(JSON.parse(storedBooks));
                return;
            }
    
            let books = [];
            let page = 1;
            while (books.length < count) {
                const response = await axios.get(`https://openlibrary.org/search.json?q=novel&rows=${count}&page=${page}`);
                if (response.data && response.data.docs) {
                    const booksWithCovers = response.data.docs.filter(book => book.cover_i);
                    books = [...books, ...booksWithCovers];
                }
                page++;
            }
            // Store books data and current date in localStorage
            localStorage.setItem('books', JSON.stringify(books.slice(0, count)));
            localStorage.setItem('booksDate', currentDate);
            setBooks(books.slice(0, count));
        } catch (error) {
            console.error("Error fetching data from OpenLibraryAPI", error);
        }
    };
    
    

    return (
        <div className="featured-novels-container">
          <h2>Today's Featured Novels</h2>
          <div className="d-flex justify-content-around flex-wrap">
            {books.length > 0 ? (
              books.map((book) => (
                <Card key={book.key} className="featured-novels-card">
                  <Link to={`/books${book.key}`}>
                    <Card.Img
                      className="featured-novels-image"
                      variant="top"
                      src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                      alt={`Cover for ${book.title}`}
                    />
                    <Card.Body className="featured-novels-text">
                      <Card.Title className="featured-novel-book-title">
                        {book.title}
                      </Card.Title>
                      <Card.Text className="featured-novel-author">
                        {book.author_name && book.author_name.join(", ")}
                      </Card.Text>
                    </Card.Body>
                  </Link>
                </Card>
              ))
            ) : (
              <p>Awaiting Open Library API...</p>
            )}
          </div>
        </div>
      );
      
};

export default FeaturedBooks;
