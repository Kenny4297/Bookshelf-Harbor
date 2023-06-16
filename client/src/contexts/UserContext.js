import React, { useState, useEffect, createContext } from "react";
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ userId: null, shoppingCart: null });

  useEffect(() => {
    console.log("Testing the UserContext useEffect?");
  
    const fetchUser = async () => {
      try {
        console.log("fetch user async function");
        // This route fetches the user data associated with the JWT in the cookie
        const response = await axios.get(`/api/user/me`);
  
        // Extract necessary user data
        let { _id: userId, shoppingCart } = response.data;
  
        // Check if the user has a shoppingCart, if not, create one
        if (!shoppingCart) {
          console.log("route to create shopping cart");
          const cartResponse = await axios.post(`/api/user/${userId}/cart/create`);
          shoppingCart = cartResponse.data.shoppingCart;
        }
  
        // Update state with the extracted user data
        setUser(prevUser => ({ ...prevUser, userId, shoppingCart }));
      } catch (error) {
        // Log any errors
        console.error(error);
      }
    };
  
    fetchUser();
  }, [user]);
  
  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  );
};
