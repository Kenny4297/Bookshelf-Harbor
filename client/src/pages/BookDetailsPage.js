import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function BookDetailsPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    fetch(`https://openlibrary.org/works/${id}.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data) {
          setBook(data);
        }
      })
      .catch((error) => console.log(error));
  }, [id]);

  useEffect(() => {
    console.log(book);
    console.log(book?.authors);
    console.log(book?.authors[0]?.author?.key); // "/authors/OL21594A"

    if (book && book.authors) {
      const fetchAuthor = (author) => {
        const authorKey = author.author.key;
        return fetch(`https://openlibrary.org${authorKey}.json`)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .catch((error) => console.log(error));
      };

      Promise.all(book.authors.map(fetchAuthor))
        .then((authors) => {
          setAuthors(authors.filter(Boolean));
        })
        .catch((error) => console.log(error));
    }
  }, [book]);

  if (!book) {
    return <div style={{ color: "white" }}>Loading...</div>;
  }

  return (
    <div>
      <h1>Book Details Page</h1>
      <h2>{book.title}</h2>
      <p>
        Author:{" "}
        {authors.length > 0 &&
          authors.map((author, index) => (
            <span key={author.key}>
              {author.name}
              {index < authors.length - 1 ? ", " : ""}
            </span>
          ))}
      </p>
      <p>Publisher: {book.publishers && book.publishers[0].name}</p>
      <p>Publication Date: {book.publish_date}</p>
      <p>Number of Pages: {book.number_of_pages}</p>
    </div>
  );
}

export default BookDetailsPage;
