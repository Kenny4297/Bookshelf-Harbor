import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Checkout, Header } from './components';
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
import { ShoppingCart, CheckoutForm, ThankYou } from './components';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';
import TestComponent from './components/testComponent';
import Account from './components/profile/Account';
import Orders from './components/profile/Orders';
import SpecificOrder from './components/profile/SpecificOrder'
import CategoryComponent from './components/Categories/CategoryComponent'

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
        <div>
        {!user ? (
            <>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="*" element={<LoginPage />} /> 
              </Routes>
            </>
        ) :(
          <>
            <Header setSearchTerm={setSearchTerm} />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile/:userId" element={<ProfilePage />} />
              <Route path="/profile/account/:userId" element={<Account />} />
              <Route path="/profile/orders/:userId" element={<Orders />} />
              <Route path="/specificOrder/:orderId" element={<SpecificOrder/>} />

              <Route path="/test" element={<TestComponent />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/books/works/:key" element={<BookDetailsPage />} />
              <Route path="/individual-book/:id" element={<IndividualBook searchTerm={searchTerm} />} />            
              <Route path="/shoppingCart/:userId" element={<ShoppingCart />} />
              <Route path="/checkout/:userId" element={<CheckoutForm />} />
              <Route path="/thankYou/:userId" element={<ThankYou />} />

              <Route path="/categories/:category" element={<CategoryComponent />} />
            </Routes>
          </>
        )}
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}



export default App;
