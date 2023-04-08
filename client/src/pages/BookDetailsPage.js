import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function BookDetailsPage() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [author, setAuthor] = useState(null);
  
    useEffect(() => {
        fetch(`https://openlibrary.org/works/${id}.json`)
          .then((response) => response.json())
          .then((data) => {
            if (data) {
              setBook(data);
            }
            console.log(data);
          })
          .catch((error) => console.log(error));
        
        if (book && book.authors) {
          book.authors.forEach((author) => {
            fetch(`https://openlibrary.org${author.key}.json`)
              .then((response) => response.json())
              .then((data) => {
                if (data) {
                  console.log(data);
                  setAuthorData(data);
                }
              })
              .catch((error) => console.log(error));
          });
        }
      }, [id, book]);
  
    if (!book) {
      return <div style={{color: 'white'}}>Loading...</div>;
    }
  
    return (
      <div>
        <h1>Book Details Page</h1>
        <h2>{book.title}</h2>
        <p>Author: {authorData && authorData.name}</p>
        <p>Publisher: {book.publishers && book.publishers[0].name}</p>
        <p>Publication Date: {book.publish_date}</p>
        <p>Number of Pages: {book.number_of_pages}</p>
      </div>
    );
  }
  

export default BookDetailsPage;
