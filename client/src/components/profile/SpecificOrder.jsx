import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SpecificOrder = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        fetchOrder();
    }, []);

    const fetchOrder = async () => {
        try {
            const response = await fetch(`/api/orders/order/${orderId}`);
            const data = await response.json();
            setOrder(data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return order ? (
        <section aria-labelledby="order-heading">
            <h2 id="orders-heading">Order #{order._id}</h2>
            {order.books.map((item) => (
                <div
                    key={item.book._id}
                    aria-labelledby={`title-${item.book._id}`}
                >
                    <h3 id={`title-${item.book._id}`}>{item.book.title}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: {item.book.price}</p>
                </div>
            ))}
            <p>Order Date: {new Date(order.date).toLocaleDateString()}</p>
            <p>Total: {order.total}</p>
        </section>
    ) : (
        <p aria-live="polite">Loading...</p>
    );
};

export default SpecificOrder;
