import React, { useContext, useEffect, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { UserContext } from "../../contexts/UserContext";
import { useParams, useNavigate } from "react-router-dom";
import {
    calculateSalesTax,
    calculateTotalWithoutTax,
    calculateTotalWithTaxAndShipping,
    calculateShippingCost,
} from "../../utils/cartCalculations";

const CheckoutFormInner = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [user, ] = useContext(UserContext);
    const { userId } = useParams();
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [billingDetails, setBillingDetails] = useState({
        firstName: "",
        lastName: "",
        address: "",
        billingAddress: "",
        expDate: "",
    });

    const handleInputChange = (event) => {
        const { value, name } = event.target;
        setBillingDetails({
            ...billingDetails,
            [name]: value,
        });
    };

    const getPaymentIntent = async () => {
        const response = await axios.post(
            "http://localhost:3001/create-payment-intent",
            { amount: 1000 }
        );
        return response.data.clientSecret;
    };

    const calculateTotals = () => {
        const preTaxTotal = calculateTotalWithoutTax(cartItems).toFixed(2);
        const salesTax = calculateSalesTax(cartItems).toFixed(2);
        const shippingCost = calculateShippingCost(cartItems).toFixed(2);
        const totalWithTaxAndShipping =
            calculateTotalWithTaxAndShipping(cartItems).toFixed(2);

        return {
            preTaxTotal,
            salesTax,
            shippingCost,
            totalWithTaxAndShipping,
        };
    };

    const totals = calculateTotals();

    const clearShoppingCart = async () => {
        try {
            const response = await axios.post(`/api/user/${userId}/cart/clear`);
            if (response.status === 200) {
                setCartItems([]);
            }
        } catch (error) {
            console.error("Error clearing shopping cart: ", error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setIsLoading(true);

        const clientSecret = await getPaymentIntent();

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            },
        });

        if (result.error) {
            console.log(result.error.message);
            setIsLoading(false);
        } else {
            if (result.paymentIntent.status === "succeeded") {
                const orderToInsert = {
                    user: user._id,
                    books: cartItems.map((item) => ({
                        book: {
                            title: item.title,
                            author: item.author,
                            first_publish_year: item.first_publish_year,
                            cover_i: item.cover_i,
                            key: item.key,
                            price: item.price,
                            subject: item.subject,
                            _id: item._id,
                        },
                        quantity: item.quantity,
                    })),
                    total: parseFloat(totals.totalWithTaxAndShipping),
                    date: new Date(),
                };

                const response = await axios.post(`/api/orders`, orderToInsert);

                if (response.status === 201) {
                    clearShoppingCart();
                    navigate(`/thankYou/${userId}`);
                } else {
                    console.error("Error creating order");
                }
            }
        }
        setIsLoading(false);
    };

    const cardStyle = {
        style: {
            base: {
                color: "black",
                fontSize: '1.5rem',
                padding: '20px',
                height: '2rem',
                backgroundColor: 'white',
                border: '6px solid #7F7F7F', 
                borderRadius: '5px', 
                "::placeholder": {
                    color: "black",
                },
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a",
            },
        },
    };
    

    useEffect(() => {
        const fetchShoppingCartData = async () => {
            if (!userId) {
                console.error("userId is undefined");
                return;
            }

            try {
                const response = await axios.get(
                    `/api/user/${userId}/cart/data`
                );
                const books = Array.isArray(response.data.shoppingCart.books)
                    ? response.data.shoppingCart.books
                    : [];
                setCartItems(books);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setCartItems([]);
                } else {
                    console.error("Error fetching data: ", error);
                }
            }
        };

        fetchShoppingCartData();
    }, [userId, user?.shoppingCart]); 


    return (
        <section className="checkout-container" aria-labelledby="checkout-heading">
            <h2 className="checkout-h2" id="checkout-heading">
                Checkout
            </h2>
            <section className="credit-card-container">
                <section className="checkout-form-field">
                    <form className="form-field" onSubmit={handleSubmit}>
                        <section className="form-column">
                            <label>
                                First Name:
                                <input
                                    id="firstName"
                                    type="text"
                                    name="firstName"
                                    required
                                    onChange={handleInputChange}
                                    value={billingDetails.firstName}
                                    minLength={1}
                                    aria-label="First Name"
                                />
                            </label>

                            <label>
                                Last Name:
                                <input
                                    id="lastName"
                                    type="text"
                                    name="lastName"
                                    required
                                    onChange={handleInputChange}
                                    value={billingDetails.lastName}
                                    minLength={1}
                                    aria-label="Last Name"
                                />
                            </label>

                            <label>
                                Address:
                                <input
                                    id="address"
                                    type="text"
                                    name="address"
                                    required
                                    onChange={handleInputChange}
                                    placeholder="Enter a fake address"
                                    value={billingDetails.address}
                                    minLength={1}
                                    aria-label="Address"
                                />
                            </label>
                        </section>
                        <section className="form-column">
                            <label>
                                Billing Address:
                                <input
                                    id="billingAddress"
                                    type="text"
                                    name="billingAddress"
                                    placeholder="Enter a fake billing address"
                                    required
                                    onChange={handleInputChange}
                                    value={billingDetails.billingAddress}
                                    minLength={1}
                                    aria-label="Billing Address"
                                />
                            </label>
                            <p className="checkout-warning" aria-live="polite">
                                Do not use a real credit card number. Please use
                                the following:
                            </p>
                            <p className="checkout-warning" aria-live="polite">
                                4242 4242 4242 4242, 05/39, 123
                            </p>
                            
                        </section>
                        <div className="card-element-wrapper"
                                >
                                <CardElement
                                    options={cardStyle}
                                    aria-label="Credit Card Input"
                                />
                                </div>
                        <button type="submit" aria-label="Submit Payment">
                            Submit Payment
                        </button>
                        {isLoading && (
                            <p
                                style={{ color: "black", marginLeft: "1rem" }}
                                aria-live="polite"
                            >
                                Processing...
                            </p>
                        )}
                    </form>

                    <section className="checkout-total-section">
                        <p className="standard">
                            Pre-tax total:{" "}
                            <span className="generated">
                                ${totals.preTaxTotal}
                            </span>
                        </p>
                        <p className="standard">
                            Sales tax (6%):{" "}
                            <span className="generated">
                                ${totals.salesTax}
                            </span>
                        </p>
                        <p className="standard">
                            Shipping Cost:{" "}
                            <span className="generated">
                                ${totals.shippingCost}
                            </span>
                        </p>
                        <hr />
                        <p className="standard">
                            Total with tax and shipping:{" "}
                            <span className="generated">
                                ${totals.totalWithTaxAndShipping}
                            </span>
                        </p>
                    </section>
                </section>
            </section>

            <section
                className="checkout-book-total-container"
                aria-labelledby="cart-heading"
            >
                {cartItems.length > 0 ? (
                    <>
                        <section className="checkout-individual-book-section">
                            {cartItems.map((book, index) => (
                                <div
                                    className="checkout-individual-book"
                                    key={index}
                                >
                                    <h4>{book.title}</h4>
                                    <h5>{book.author.join(", ")}</h5>
                                    <img
                                        src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                                        alt="cover"
                                    />
                                    <p>${book.price}</p>
                                </div>
                            ))}
                        </section>
                    </>
                ) : (
                    <p>Your shopping cart is empty.</p>
                )}
            </section>
        </section>
    );
};

export default CheckoutFormInner;
