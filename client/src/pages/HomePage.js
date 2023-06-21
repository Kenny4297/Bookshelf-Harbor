import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { Link } from "react-router-dom";
import axios from 'axios';
import styled from "styled-components";
import NileHero from '../components/assets/images/NileHero.jpg'
import FeaturedProducts from '../components/Home/FeaturedProducts'
import CategoriesPage from './CategoriesPage'
import Footer from '../components/Home/Footer'

const HomePage = () => {
    const [user, setUser] = useContext(UserContext);

    // This useEffect is used for debugging purposes. It only runs when the component is mounted (the first time it is rendered) and if the user variable changes. 
    useEffect(() => {
        console.log("Checking to see if the user is being updated")
        console.log(user);
        if (user) {
            console.log(user._id);
            // console.log(user.shoppingCart.books);
        }
        // user
    }, [user]);

    //Here we are keeping track of the data in the search bar. If it changes, the state will be updated
    const [searchTerm, setSearchTerm] = useState('');

    //Here we are keeping track of the book data. Once the book changes, the state is the updated. 
    const [bookData, setBookData] = useState([]);
  
    const handleInputChange = event => {
        console.log(searchTerm)
        setSearchTerm(event.target.value);
    };
  
    const handleFormSubmit = event => {
        event.preventDefault();
        const query = searchTerm.replace(/ /g, '+');
        const url = `https://openlibrary.org/search.json?title=${query}`;
        fetch(url)
            .then(response => response.json())
            
            //This saves the data as bookData, and we use this variable to map through it later on
            .then(data => setBookData(data.docs));
        setSearchTerm('');
    };

    useEffect(() => {
        if (user && user._id) {
          axios.get(`/api/user/${user._id}/cart/data`)
            .then(response => {
              console.log(response.data);
              const { shoppingCart } = response.data;
              if (shoppingCart === null) { // Check if shoppingCart is null
                // If the shopping cart doesn't exist, create a new one
                axios.post(`/api/user/${user._id}/cart/create`)
                  .then(response => {
                    const { shoppingCart } = response.data;
                    setUser({ ...user, shoppingCart });
                  })
                  .catch(error => console.error(error));
              } else {
                // If shopping cart exists, set the shopping cart in the user context
                setUser({ ...user, shoppingCart });
              }
            })
            .catch(error => console.error(error));
        }
      }, [user && user._id]);
      

    return (
        <>
            <HeroContainer>
                <IntroductionSection>
                <h1>Welcome to Nile</h1>

                <p>Search though millions of books and have them sent right to your doorstep</p>
                { user && user.id &&
                    <>
                        <p>UserID: {user._id}</p>
                        <p>Email: {user.email}</p>
                    </>
                }

                <p>Testing the Open Book API</p>
                </IntroductionSection>

                <Link to="/categories">Categories</Link>

                <div>
                    <form onSubmit={handleFormSubmit}>
                        <input type="text" value={searchTerm} style={{color: 'black'}} onChange={handleInputChange} />
                        <button type="submit">Search</button>
                    </form>
                    <ul>
                        {bookData.map(book => (
                        <li key={book.key}>
                            <h3>{book.title}</h3>
                            {book.author_name && (
                            <p>
                                by{' '}
                                {book.author_name.length > 1
                                ? book.author_name.join(', ')
                                : book.author_name}
                            </p>
                            )}
                            {book.cover_i && (
                            <img
                                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                                alt={`${book.title} cover`}
                            />
                            )}
                        </li>
                        ))}
                    </ul>
                </div>
            </HeroContainer>

            <FeaturedProducts />

            <CategoriesPage />

            <Footer />
        </>
    )
}

export default HomePage;

const HeroContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* align-items: center; */
    width: 100%;
    height: 95vh;
    padding: 0 !important;
    margin: 0 !important;
    background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${NileHero});
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
`

const IntroductionSection = styled.div`
    margin-left: 3rem;
`