import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';

const ThankYou = () => {
  const { userId } = useParams();
  const [order, setOrder] = useState(null);
  const [user, setUser] = useContext(UserContext);

  const [isReceiptRequested, setIsReceiptRequested] = useState(false);

  const handleReceiptRequest = () => {
    setIsReceiptRequested(true);
  };

  useEffect(() => {
    console.log(user);
    });

  useEffect(() => {
    const fetchOrder = async () => {
      console.log("Fetch order useEffect?")
      const response = await axios.get(`/api/orders/order/${userId}/last`);
      setOrder(response.data);
      console.log(response.data)

    }
    fetchOrder();
  }, [user]);

  if (!order) {
    return <p>Loading...</p>;
  }

  return (
    <div className="thank-you-container">
      <h2>Thank you for your order!</h2>
      <h3>Order Number: <span>{order._id}</span></h3>
      {/* {order.books.map((item, index) => (
        <div key={index}>
          <h3>{item.book.title}</h3>
          <img src={`https://covers.openlibrary.org/b/id/${item.book.cover_i}-M.jpg`} alt="cover" />
          <p>Author: {item.book.author.join(', ')}</p>
          <p>First published year: {item.book.first_publish_year}</p>
          <p>Price: ${item.book.price}</p>
          <p>Quantity: {item.quantity}</p>
        </div>
      ))}
      <h2>Total: ${order.total}</h2> */}

      {isReceiptRequested ? (
        <>
          <p className="send-me-receipt-desc">
            Thank you for your mock purchase! If this were a real e-commerce site, a receipt would be sent to your email. However, for the purpose of this demonstration and to protect your privacy, no email will be sent.
          </p>
          
          <Link className="send-me-receipt-button" to="/">Back to Home</Link>

        </>
      ) : (
        <button className="send-me-receipt-button" onClick={handleReceiptRequest}>
          "Send" me an email receipt (but not really)
        </button>
      )}
    </div>
  );
};

export default ThankYou;
