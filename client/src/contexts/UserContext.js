import React, { useState, useEffect, createContext } from "react";
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("Testing hte UserContext useEffect?")
    // This route fetches the user data associated with the JWT in the cookie
    axios.get(`/api/user/me`)
    console.log("Testing hte UserContext request?")
      .then(response => {
        // Update state with the received user data
        setUser(response.data);
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