import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const { userId } = useParams(); // Get userId from URL parameters

  useEffect(() => {
    const fetchShoppingCartData = async () => {
      if (!userId) {
        console.error("userId is undefined");
        return;
      }
  
      try {
        const response = await axios.get(`/api/user/${userId}/cart/data`);
        const books = Array.isArray(response.data.books) ? response.data.books : [];
        setCartItems(books);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setCartItems([]);
        } else {
          console.error("Error fetching data: ", error);
        }
      }
    };
  
    fetchShoppingCartData();
  }, [userId]);

  useEffect(() => {
    console.log(cartItems);
  });

  const removeFromCart = (bookId) => {
    axios
      .post(`/api/user/${userId}/cart/remove`, { bookId }) // pass the bookId as a parameter in the request body
      .then((response) => {
        // update your cartItems state to reflect the book removal
        setCartItems(cartItems.filter((book) => book._id !== bookId));
      })
      .catch((error) => {
        console.error("Error removing book: ", error);
      });
  }

  const clearCart = () => {
    axios.post(`/api/user/${userId}/cart/clear`)
      .then(response => {
        console.log(response.data);
        setCartItems([]); // Clear the local state
  
        // Call updateUser function here
        axios.put(`/api/user/${userId}`, { shoppingCart: response.data._id })
          .then(response => {
            console.log("User updated: ", response.data);
          })
          .catch(error => {
            console.error("Error updating user: ", error);
          });
      })
      .catch(error => {
        console.error("Error clearing cart: ", error);
      });
  };
  

  return (
    <div>
      <h1>Shopping Cart</h1>
      {cartItems.length > 0 ? (
        <>
          <ul>
            {cartItems.map((book, index) => (
              <li key={index}>
                <h2>{book.title}</h2>
                <h3>Author: {book.author.join(', ')}</h3>
                <p>First published year: {book.first_publish_year}</p>
                <p>Price: ${book.price}</p>
              </li>
            ))}
          </ul>
          <button onClick={clearCart}>Clear Cart</button>
        </>
      ) : (
        <p>Your shopping cart is empty.</p>
      )}
    </div>
  );
}

export default ShoppingCart;
