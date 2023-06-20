import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import styled from 'styled-components';
import defaultImage from '../components/assets/images/defaultImage.jpg'


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
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {book.map((bookItem, index) => (
        <Link to={`/book-details/${bookItem.key.replace("/works/", "")}`} style={{ textDecoration: 'none', color: 'inherit' }} key={index}>
          <Card>
            {bookItem.cover_i ? (
              <Image src={`https://covers.openlibrary.org/b/id/${bookItem.cover_i}-M.jpg`} alt='book cover' />
            ) : (
              <Image src={defaultImage} alt='Default book cover' />
            )}
            <Title>{bookItem.title}</Title>
            <Author>{bookItem.author_name && bookItem.author_name.join(", ")}</Author>
          </Card>
        </Link>
      ))}
    </div>
  );
  
}

export default IndividualBook;

const Card = styled.div`
  border-radius: 5px;
  padding: 15px;
  margin: 10px;
  width: 200px;
  height: auto;
  min-height: 350px; 
  max-height: 350px; 
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 10px 10px -7px rgba(0,0,0,0.1);
  border: 2px solid white;
  transition: all 0.3s ease-out;
  &:hover {
    box-shadow: 0px 10px 10px -2px rgba(0,0,0,0.1);
  }
`;


const Image = styled.img`
  min-height: 10rem;
  max-height: 10rem;
  min-width: 7rem;
  max-width: 11rem;
  /* width: auto; */
  margin-bottom: 15px;
`;

const Title = styled.h3`
  margin: 0;
  margin-bottom: 10px;
  text-align: center;
  font-size: 1.2em;
`;

const Author = styled.p`
  font-size: 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 90%; 
  max-width: 90%; 
  color: white;
`;

