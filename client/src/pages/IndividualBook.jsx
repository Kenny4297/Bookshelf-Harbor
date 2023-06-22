import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import defaultImage from '../components/assets/images/defaultImage.jpg'

function IndividualBook() {
  const location = useLocation();
  const searchTerm = location.state?.searchTerm;
  const [book, setBook] = useState([]);
  const [user, setUser] = useContext(UserContext);
  const [page, setPage] = useState(0);
  
  useEffect(() => {
    if (searchTerm) {
      fetch(`https://openlibrary.org/search.json?title=${searchTerm}&page=${page + 1}&limit=20`)
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
  }, [searchTerm, page]);

  const handleNextPage = () => {
    setPage(page + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <div className="book-container">
      <h2 className='book-results-for-h2'>Results for <span className="search-term-results">'{searchTerm}'</span></h2>
      
      <div className="book-grid">
        {book.map((bookItem, index) => (
          <Link to={`/books/works/${bookItem.key.replace("/works/", "")}`} className="book-card" key={index}>
            <div className="book-card-content">
              {bookItem.cover_i ? (
                <img className="book-card-image" src={`https://covers.openlibrary.org/b/id/${bookItem.cover_i}-M.jpg`} alt='book cover' />
              ) : (
                <img className="book-card-image" src={defaultImage} alt='Default book cover' />
              )}
              <h3 className="book-card-title">{bookItem.title}</h3>
              <p className="book-card-author">{bookItem.author_name && bookItem.author_name.join(", ")}</p>
            </div>
          </Link>
        ))}
      </div>
      <div style={{display: 'flex', alignItems:'center'}}>
        <button className="individual-book-button" onClick={handlePrevPage} disabled={page === 0}>Previous Page</button>

         <p style={{color:'var(--grey-wood'}}>page: {page + 1}</p>

        <button className="individual-book-button" onClick={handleNextPage}>Next Page</button>
      </div>
    </div>
    </>
  );
}

export default IndividualBook;
