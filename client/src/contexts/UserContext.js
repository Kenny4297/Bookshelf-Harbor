import React, { useState, useEffect, createContext } from "react";
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ userId: null, shoppingCart: null });

  useEffect(() => {
    console.log("Testing the UserContext useEffect?")
    // This route fetches the user data associated with the JWT in the cookie
    axios.get(`/api/user/me`)
      .then(response => {
        // Extract necessary user data
        const { _id: userId, shoppingCart } = response.data;

        // Update state with the extracted user data
        setUser({ userId, shoppingCart });
      })
      .catch(error => {
        // Log any errors
        console.error(error);
      });
  }, []); // This empty array as a second argument ensures this useEffect runs only once on component mount

  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  );
};
