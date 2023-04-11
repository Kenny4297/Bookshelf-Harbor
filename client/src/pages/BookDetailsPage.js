import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function BookDetailsPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [firstPublishDate, setFirstPublishDate] = useState(null);
  const [description, setDescription] = useState("");

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
    if (book && book.created) {
      const createdDate = new Date(book.created.value);
      const options = { month: 'long', day: 'numeric', year: 'numeric' };
      const formattedDate = createdDate.toLocaleDateString('en-US', options);
      setFirstPublishDate(formattedDate);
    }
  }, [book]);

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

  useEffect(() => {
    if (book && book.description) {
      setDescription(book.description);
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
      <p>Publication Date: {firstPublishDate}</p>
      <p>Description: {description}</p>
    </div>
  );
}

export default BookDetailsPage;
