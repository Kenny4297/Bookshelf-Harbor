import React from 'react';
import Carousel from 'react-bootstrap/Carousel';

function BookCarousel(props) {
  const { books } = props;

  
  books.forEach((book, index) => {
    if (book.cover_edition_key) {
        console.log("Testing?")
      console.log(`Image URL for ${book.title}: https://covers.openlibrary.org/b/id/${book.cover_edition_key[0]}-L.jpg`);
    }
  });

  return (
    <Carousel>
      {books.map((book, index) => (
        <Carousel.Item key={index}>
            <img
            className="d-block w-100"
            src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
            alt={`Cover for ${book.title}`}
            />
          <Carousel.Caption>
            <h3>{book.title}</h3>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default BookCarousel;
