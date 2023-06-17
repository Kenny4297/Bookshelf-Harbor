import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
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
import { ShoppingCart, CheckoutForm } from './components';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';
import TestComponent from './components/testComponent';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API);

// 

// Above is Stripes secret key for the back end

const App = () => {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    console.log("Testing App.js UseEffect for the'/me/' route");
    const authToken = localStorage.getItem("auth-token"); 
    if (authToken) {
      axios
        .get(`/api/user/me`, {
          headers: {
            "auth-token": authToken
          }
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  return (
    <BrowserRouter>
      <UserContext.Provider value={[user, setUser]}>
        <Header setSearchTerm={setSearchTerm} />
        <div className="pt-3 px-4">
          <Elements stripe={stripePromise}>
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
              <Route path="/checkout/:userId" element={<CheckoutForm />} />
            </Routes>
          </Elements>
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
