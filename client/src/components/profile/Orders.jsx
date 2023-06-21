import { useEffect, useState, useContext } from 'react';
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
      const data = await response.json();
      if (Array.isArray(data)) {
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
    fetchSpecificOrder(orderId);
  };

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h2 className="orders-h2">Your Orders:</h2>
        {orders.map((order) => (
          <button onClick={() => handleOrderClick(order._id)} key={order._id} className="orders-individual-orders">
            <p className="orders-orderId-p">Order#: {order._id}</p>
            <p className="orders-orderDate-p">{new Date(order.date).toLocaleDateString()}</p>
          </button>
        ))}
      </div>
      <div className="individual-order-wrapper">
        {selectedOrder && (
          <div className="individual-order">
            <h2>Order number:</h2>
            <p>{selectedOrder._id}</p>
            {selectedOrder.books && selectedOrder.books.length > 0 ? selectedOrder.books.map((item, index) => (
              <div key={index}>
                <h3>{item.book.title}</h3>
                <p>Quantity: {item.quantity}</p>
                <p>Price: {item.book.price}</p>
              </div>
            )) : <p>No books found for this order.</p>}
            <p>Order Date: {new Date(selectedOrder.date).toLocaleDateString()}</p>
            <p>Total: {selectedOrder.total}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
