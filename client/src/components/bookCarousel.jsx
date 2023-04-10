import React from 'react';
import { Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';

function BookCarousel(props) {
  const { books } = props;

  return (
    <Carousel>
      {books.map((book, index) => (
        <Carousel.Item key={index}>
          <div className="text-center">
            <Link to={`/books${book.key}`}> {/* make sure `book.key` is correctly passed */}
              <img
                className="d-block mx-auto"
                src={`https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`}
                alt={`Cover for ${book.title}`}
              />
              <Carousel.Caption className="mt-2">
                <h4>{book.author_name}</h4>
                <p>{book.first_publish_year}</p>
              </Carousel.Caption>
            </Link>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default BookCarousel;
