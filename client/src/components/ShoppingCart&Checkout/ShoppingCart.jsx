import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import Loading from '../Loading'

const ShoppingCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const { userId } = useParams(); 
    const [user, setUser] = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(true);

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
                setIsLoading(false)
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

    const removeFromCart = (bookId) => {
        axios
            .post(`/api/user/${userId}/cart/remove`, { bookId })
            .then((response) => {

                // Filter out the removed book from your local state by comparing book ID
                const updatedCartItems = cartItems.filter(
                    (book) => book._id !== bookId
                );
                setCartItems(updatedCartItems);

                // also update the shoppingCart in the user context
                if (user?.shoppingCart) {
                    // Adding the check for user?.shoppingCart
                    setUser((prevUser) => ({
                        ...prevUser,
                        shoppingCart: {
                            ...prevUser.shoppingCart,
                            books: updatedCartItems,
                        },
                    }));
                }
            })
            .catch((error) => {
                console.error("Error removing book: ", error);
            });
    };

    const clearCart = () => {
        axios
            .post(`/api/user/${userId}/cart/clear`)
            .then((response) => {
                setCartItems([]);

                axios
                    .put(`/api/user/${userId}`, {
                        shoppingCart: response.data._id,
                    })
                    .then((response) => {
                    })
                    .catch((error) => {
                        console.error("Error updating user: ", error);
                    });
            })
            .catch((error) => {
                console.error("Error clearing cart: ", error);
            });
    };

    const calculateSalesTax = () => {
        const taxRate = 0.06; // 6% sales tax
        const totalPrice = cartItems.reduce(
            (total, book) => total + book.price,
            0
        );
        return totalPrice * taxRate;
    };

    const calculateTotalWithoutTax = () => {
        return cartItems.reduce((total, book) => total + book.price, 0);
    };

    const calculateTotalWithTaxAndShipping = () => {
        const shippingCostPerBook = 5; 
        const totalPrice = calculateTotalWithoutTax();
        const tax = calculateSalesTax();
        const shippingCost = cartItems.length * shippingCostPerBook;
        return totalPrice + tax + shippingCost;
    };

    const calculateShippingCost = () => {
        const shippingCostPerBook = 5; 
        return cartItems.length * shippingCostPerBook;
    };

    const totals = calculateTotals();

    if (isLoading) {
        return <Loading />;
    } else {
        return (
        <section
            className="shopping-cart-container"
            aria-label="Shopping cart content"
        >
            <h2 className="shopping-cart-h2">Shopping Cart</h2>
            {cartItems.length > 0 ? (
                <section>
                    <section
                        className="shopping-cart-only-book-container"
                        aria-label="List of books in cart"
                    >
                        {cartItems.map((book, index) => (
                            <div
                                className="shopping-cart-book"
                                key={index}
                                aria-label={`Book title: ${book.title}`}
                            >
                                <div className="shopping-cart-header-author-container">
                                    <h4 className="shopping-cart-book-title-h4">
                                        {book.title}
                                    </h4>
                                    <h5 className="author-name">
                                        {book.author.join(", ")}
                                    </h5>
                                </div>
                                <img
                                    src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                                    alt="cover"
                                />
                                <p className="shopping-cart-price">
                                    Price:{" "}
                                    <span className="shopping-cart-rendered-price">
                                        ${book.price}
                                    </span>
                                </p>

                                <button
                                    className="shopping-cart-remove-button"
                                    aria-label="Remove book from cart"
                                    onClick={() => removeFromCart(book._id)}
                                >
                                    Remove from Cart
                                </button>
                            </div>
                        ))}
                    </section>

                    <section
                        className="shopping-cart-totals-container"
                        aria-label="Cart totals"
                    >
                        <section className="shopping-cart-math-container">
                            <p className="standard">
                                Pre-tax total:{" "}
                                <span className="generated">
                                    ${totals.preTaxTotal}
                                </span>
                            </p>
                            <p>
                                Sales tax (6%):{" "}
                                <span className="generated">
                                    ${totals.salesTax}
                                </span>
                            </p>
                            <p>
                                Shipping Cost:{" "}
                                <span className="generated">
                                    ${totals.shippingCost}
                                </span>
                            </p>
                        </section>
                        <hr />
                        <p className="standard">
                            Total with tax and shipping:{" "}
                            <span className="generated shopping-cart-total">
                                ${totals.totalWithTaxAndShipping}
                            </span>
                        </p>

                        <button
                            className="shopping-cart-clear-cart"
                            onClick={clearCart}
                        >
                            Clear Cart
                        </button>
                        <Link
                            className="shopping-cart-clear-cart"
                            to={`/checkout/${userId}`}
                            aria-label="Checkout"
                        >
                            Checkout
                        </Link>
                    </section>
                </section>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                        }}
                        aria-label="Empty cart message"
                    >
                        <h2 className="shopping-cart-empty-message">
                            Your shopping cart is empty
                        </h2>
                        <Link
                            className="back-to-home"
                            to="/"
                            aria-label="Back to home"
                        >
                            Back to home
                        </Link>
                    </div>
                )}
            </section>
        
        );
    }
};

export default ShoppingCart;
