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
		<div className='shopping-cart-container'>
		  <h2 className="shopping-cart-h2">Shopping Cart</h2>
		  {cartItems.length > 0 ? (
			<div>
				<div className="shopping-cart-only-book-container">
					{cartItems.map((book, index) => (
						
						<div className="shopping-cart-book" key={index}>
							<div className="shopping-cart-header-author-container">
								<h4 className='shopping-cart-book-title-h4'>{book.title}</h4>
								<h5 className="author-name">{book.author.join(', ')}</h5>
							</div>
						<img src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`} alt="cover" />
						<p className='shopping-cart-price'>Price: <span className="shopping-cart-rendered-price">${book.price}</span></p>

						<button className="shopping-cart-remove-button" onClick={() => removeFromCart(book._id)}>Remove from Cart</button>
						</div>
					))}
			  </div>

			  <div className="shopping-cart-totals-container">
				<div className="shopping-cart-math-container">
					<p>Pre-tax total: ${totals.preTaxTotal}</p>
					<p>Sales tax (6%): ${totals.salesTax}</p>
					<p>Shipping Cost: ${totals.shippingCost}</p>
				</div>
				<hr />
				<p>Total with tax and shipping: ${totals.totalWithTaxAndShipping}</p>
				<button className="shopping-cart-clear-cart" onClick={clearCart}>Clear Cart</button>
				<Link className="shopping-cart-clear-cart" to={`/checkout/${userId}`}>Checkout</Link>


			  </div>
			</div>
		  ) : (
			<p>Your shopping cart is empty.</p>
		  )}
		</div>
	  );
}

export default ShoppingCart;
