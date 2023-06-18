import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { UserContext } from "../contexts/UserContext";
import { 
    calculateSalesTax, 
    calculateTotalWithoutTax, 
    calculateTotalWithTaxAndShipping, 
    calculateShippingCost 
} from '../utils/cartCalculations'; 

const ShoppingCart = () => {
const [cartItems, setCartItems] = useState([]);
const { userId } = useParams(); // Get userId from URL parameters
const [user, setUser] = useContext(UserContext);

const calculateTotals = () => {
	const preTaxTotal = calculateTotalWithoutTax(cartItems).toFixed(2);
	const salesTax = calculateSalesTax(cartItems).toFixed(2);
	const shippingCost = calculateShippingCost(cartItems).toFixed(2);
	const totalWithTaxAndShipping = calculateTotalWithTaxAndShipping(cartItems).toFixed(2);
	
	return {
		preTaxTotal,
		salesTax,
		shippingCost,
		totalWithTaxAndShipping
	}
}

useEffect(() => {
	const fetchShoppingCartData = async () => {
	if (!userId) {
		console.error("userId is undefined");
		return;
	}

	try {
		const response = await axios.get(`/api/user/${userId}/cart/data`);
		const books = Array.isArray(response.data.shoppingCart.books) ? response.data.shoppingCart.books : [];
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
	}, [userId, user?.shoppingCart]); // Adding the optional chaining operator '?'

	useEffect(() => {
		console.log(cartItems);
	});

	useEffect(() => {
		console.log(user);
	});

const removeFromCart = (bookId) => {
	console.log("Book ID to remove:", bookId);
	console.log("removeFromCart function called")
	axios
	.post(`/api/user/${userId}/cart/remove`, { bookId }) 
	.then((response) => {
		console.log("Response from server: ", response.data); // Add this line
		
		// Filter out the removed book from your local state by comparing book ID
		const updatedCartItems = cartItems.filter((book) => book._id !== bookId); 
		setCartItems(updatedCartItems);

		// also update the shoppingCart in the user context
		if(user?.shoppingCart) { // Adding the check for user?.shoppingCart
		setUser(prevUser => ({
			...prevUser,
			shoppingCart: {
			...prevUser.shoppingCart,
			books: updatedCartItems
			}
		}));
		}
	})
	.catch((error) => {
		console.error("Error removing book: ", error);
	});
}

const clearCart = () => {
	axios.post(`/api/user/${userId}/cart/clear`)
	.then(response => {
		console.log(response.data);
		setCartItems([]); // Clear the local state

		// Call updateUser function here
		axios.put(`/api/user/${userId}`, { shoppingCart: response.data._id })
		.then(response => {
			console.log("User updated: ", response.data);
		})
		.catch(error => {
			console.error("Error updating user: ", error);
		});
	})
	.catch(error => {
		console.error("Error clearing cart: ", error);
	});
};

	const calculateSalesTax = () => {
		const taxRate = 0.06; // 6% sales tax
		const totalPrice = cartItems.reduce((total, book) => total + book.price, 0);
		return totalPrice * taxRate;
	};

	const calculateTotalWithoutTax = () => {
		return cartItems.reduce((total, book) => total + book.price, 0);
	};

	const calculateTotalWithTaxAndShipping = () => {
		const shippingCostPerBook = 5; // $5 shipping cost per book
		const totalPrice = calculateTotalWithoutTax();
		const tax = calculateSalesTax();
		const shippingCost = cartItems.length * shippingCostPerBook;
		return totalPrice + tax + shippingCost;
	};

	const calculateShippingCost = () => {
	const shippingCostPerBook = 5; // $5 shipping cost per book
	return cartItems.length * shippingCostPerBook;
	}

	const totals = calculateTotals();

	return (
		<div>
			<h1>Shopping Cart</h1>
			{cartItems.length > 0 ? (
			<>
				<ul>
				{cartItems.map((book, index) => (
					<li key={index}>
					<h2>{book.title}</h2>
					<h3>Author: {book.author.join(', ')}</h3>
					<p>First published year: {book.first_publish_year}</p>
					<p>Price: ${book.price}</p>
					<button onClick={() => removeFromCart(book._id)}>Remove from Cart</button>
					</li>
				))}
				</ul>
					<p>Pre-tax total: ${totals.preTaxTotal}</p>
					<p>Sales tax (6%): ${totals.salesTax}</p>
					<p>Shipping Cost: ${totals.shippingCost}</p>
					<hr />
					<p>Total with tax and shipping: ${totals.totalWithTaxAndShipping}</p>
					<button onClick={clearCart}>Clear Cart</button>
			</>
			) : (
			<p>Your shopping cart is empty.</p>
			)}
			<Link to={`/checkout/${userId}`}> Go to Checkout</Link>
		</div>
	);
}

export default ShoppingCart;
