import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";


function IndividualBook() {
  const location = useLocation();
  const searchTerm = location.state?.searchTerm;
  const [book, setBook] = useState(null);
  const [user, setUser] = useContext(UserContext);

  
  useEffect(() => {
    if (searchTerm) {
      fetch(`https://openlibrary.org/search.json?title=${searchTerm}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.docs) {
          setBook(data.docs);
        }
      })
      .catch((error) => console.log(error));
  }
  }, [searchTerm]);

  useEffect(() => {
    console.log(book)
  }, [book])

  if (!book) {
    return <div>Loading...</div>;
  }
  const oldestPublishYear = book.reduce((acc, cur) => {
    if (!cur.publish_year || cur.publish_year.length === 0) return acc;
    const oldest = cur.publish_year.reduce((oldestYear, currentYear) => {
      return currentYear < oldestYear ? currentYear : oldestYear;
    });
    return oldest < acc ? oldest : acc;
  }, Infinity);

  return (
    <>
      {book.map((bookItem, index) => (
        <div key={index}>
          <Link to={`/book-details/${bookItem.key.replace("/works/", "")}`}>
            <h2>Title: {bookItem.title}</h2>
          </Link>
          {/* Rest of the bookItem details */}
          <p>Author: {bookItem.author_name && bookItem.author_name.join(", ")}</p>
          {bookItem.cover_i ? (
            <img src={`https://covers.openlibrary.org/b/id/${bookItem.cover_i}-M.jpg`} style={{width: '200px', height: '200px'}}alt='book cover' />
            ) : (
                <p>No cover available</p>
            )}
                    {/* 8236295 */}
        {/* http://covers.openlibrary.org/b/id/8236295-M.jpg */}
          <p>First Published: {oldestPublishYear}</p>
        </div>
      ))}
    </>
  );
}


export default IndividualBook;
