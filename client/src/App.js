import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components';
import { 
  CategoriesPage, 
  HomePage, 
  LoginPage, 
  IndividualBook, 
  ProfilePage, 
  SignupPage, 
  BookDetailsPage 
} from './pages';
import { UserContext } from './contexts/UserContext';
import { ShoppingCart } from './components';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';
import TestComponent from './components/testComponent';

const App = () => {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // This route fetches the user data associated with the JWT in the cookie
    console.log("Testing the UserContext request?")
    axios.get(`/api/user/me`)
      .then(response => {
        // Update state with the received user data
        setUser(response.data);
      })
      .catch(error => {
        // Log any errors
        console.error(error);
      });
  }, []);

  return (
    <BrowserRouter>
      <UserContext.Provider value={[user, setUser]}>
        <Header setSearchTerm={setSearchTerm} />
        <div className="pt-3 px-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/test" element={<TestComponent />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/books/works/:key" element={<BookDetailsPage />} />
            <Route path="/book-details/:key" element={<BookDetailsPage />} />
            <Route path="/shoppingCart/:userId" element={<ShoppingCart />} />
            <Route path="/individual-book/:id" element={<IndividualBook searchTerm={searchTerm} />} />
          </Routes>
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
