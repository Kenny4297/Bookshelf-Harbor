import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [user] = useContext(UserContext);
  const { userId } = useParams();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/orders/user/${userId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      let data = await response.json();
      if (Array.isArray(data)) {
        // Sort orders by date from most recent to oldest
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(data);
      } else {
        console.error('Data is not an array:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchSpecificOrder = async (orderId) => {
    console.log(`Fetching specific order with ID: ${orderId}`);
    try {
      const response = await fetch(`/api/orders/order/${orderId}`);
      const data = await response.json();
      console.log(`Fetched specific order: `, data);
      setSelectedOrder(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

const handleOrderClick = (orderId) => {
  console.log(`Order button clicked for ID: ${orderId}`);
  if (selectedOrder && selectedOrder._id === orderId) {
    setSelectedOrder(null);
  } else {
    fetchSpecificOrder(orderId);
  }
};

  return (
    <div className="orders-page">
  <div className="orders-container">
    <h2 className="orders-h2">Your Orders:</h2>
    {orders.map((order, index) => (
      <React.Fragment key={order._id}>
        <button onClick={() => handleOrderClick(order._id)} className="orders-individual-orders">
          <p className="orders-orderId-p">Order#: {order._id}</p>
          <p className="orders-orderDate-p">{new Date(order.date).toLocaleDateString()}</p>
        </button>
        {selectedOrder && selectedOrder._id === order._id && (
          <div className="individual-order-wrapper">
            <div className="individual-order">
              <h2 className="order-number-h2">Order number:</h2>
              <p className="order-number-p">{selectedOrder._id}</p>
              <p className="order-date-title">Order Date:</p> 
              <p className="order-date">{new Date(selectedOrder.date).toLocaleString()}</p>

              {selectedOrder.books && selectedOrder.books.length > 0 ? selectedOrder.books.map((item, index) => (
                <div key={index}>
                  <h3>{item.book.title}</h3>
                  <img className="order-image" src={`https://covers.openlibrary.org/b/id/${item.book.cover_i}-M.jpg`} alt="cover" />
                  <p className="quantity-p">Quantity: {item.quantity}</p>
                  <p className='price-p'>Price: ${item.book.price}</p>
                </div>
              )) : <p>No books found for this order.</p>}

              <p className="order-total">Total: ${selectedOrder.total}</p>
            </div>
          </div>
        )}
      </React.Fragment>
    ))}
  </div>
</div>
  );
};

export default Orders;