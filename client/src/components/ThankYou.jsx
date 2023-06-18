import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';

const ThankYou = () => {
  const { userId } = useParams();
  const [order, setOrder] = useState(null);
  const [user, setUser] = useContext(UserContext);

  useEffect(() => {
    console.log(user);
    });

  useEffect(() => {
    const fetchOrder = async () => {
      const response = await axios.get(`/api/orders/${userId}/last`);
      setOrder(response.data);
    }
    fetchOrder();
  }, [userId]);

  if (!order) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Thank you for your order!</h1>
      <h2>Order Number: {order._id}</h2>
      {order.books.map((item, index) => (
        <div key={index}>
          <h3>{item.book.title}</h3>
          <p>Author: {item.book.author.join(', ')}</p>
          <p>First published year: {item.book.first_publish_year}</p>
          <p>Price: ${item.book.price}</p>
          <p>Quantity: {item.quantity}</p>
        </div>
      ))}
      <h2>Total: ${order.total}</h2>
    </div>
  );
};

export default ThankYou;
