import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { Link } from "react-router-dom";
import axios from 'axios';

const HomePage = () => {
    const [user, setUser] = useContext(UserContext);

    // This useEffect is used for debugging purposes. It only runs when the component is mounted (the first time it is rendered) and if the user variable changes. 
    useEffect(() => {
        console.log(user);
        if (user) {
            console.log(user._id);
            // console.log(user.shoppingCart.books);
        }
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
        // Only run if a user is logged in
        if (user && user.userId) {
            console.log("Checking new useEffect!")
            // Fetch shopping cart
            axios.get(`/api/user/${user.userId}/cart/data`)
                .then(response => {
                    const { shoppingCart } = response.data;
                    // Update the user context
                    setUser({ ...user, shoppingCart });
                })
                .catch(error => console.error(error));
        }
    }, [user, setUser]);

    return (
        <>
            <h1>Home Page</h1>

            {!user ? (
                <p>The user is not logged in.</p>
            ) : (
                <>
                    <p>The user is logged in.</p>
                    <p>UserID: {user._id}</p>
                    {/* <p>Users Shopping Cart: {JSON.stringify(user.shoppingCart.books)}</p> */}
                    
                    <Link to="/test">Go to Test Component</Link>
                </>
            )}

            <p>Testing the Open Book API</p>

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
        </>
    )
}

export default HomePage