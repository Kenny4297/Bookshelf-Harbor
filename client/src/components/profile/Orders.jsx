import { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
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
  

  return (
    <div style={{display: 'flex', flexDirection:'column'}}>
      <h2>Your Orders:</h2>
      {orders.map(order => (
        <Link key={order._id} to={`/specificOrder/${order._id}`}>
          Order #{order._id}
        </Link>
      ))}
    </div>
  );
};

export default Orders;
