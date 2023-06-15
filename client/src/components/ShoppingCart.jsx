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
        setCartItems(response.data.books);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
  
    fetchShoppingCartData();
  }, [userId]);

  useEffect(() => {
    console.log(cartItems);
  })

  return (
    <div>
      <h1>Shopping Cart</h1>
      {cartItems.length > 0 ? (
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
      ) : (
        <p>Your shopping cart is empty.</p>
      )}
    </div>
  );
}

export default ShoppingCart;
