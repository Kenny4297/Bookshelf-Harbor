import React, { useContext, useEffect, useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    calculateSalesTax, 
    calculateTotalWithoutTax, 
    calculateTotalWithTaxAndShipping, 
    calculateShippingCost 
} from '../utils/cartCalculations';

const CheckoutFormInner = () => {
	const stripe = useStripe();
	const elements = useElements();
	const [user, setUser] = useContext(UserContext);
	const { userId } = useParams(); 
	const [cartItems, setCartItems] = useState([]);
	const navigate = useNavigate();

	const getPaymentIntent = async () => {
		// Replace with your server route that creates a payment intent.
		const response = await axios.post('http://localhost:3001/create-payment-intent', { amount: 1000 }); 
		return response.data.clientSecret;
	}

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

	const handleSubmit = async (event) => {
		event.preventDefault();
	
		const clientSecret = await getPaymentIntent();
	
		const result = await stripe.confirmCardPayment(clientSecret, {
			payment_method: {
				card: elements.getElement(CardElement)
			}
		});
	
		if (result.error) {
			console.log(result.error.message);
		} else {
			if (result.paymentIntent.status === 'succeeded') {
				const orderToInsert = {
					user: user._id, // this is the current user's id
					books: cartItems.map(item => ({
						book: {
							title: item.title,
							author: item.author,
							first_publish_year: item.first_publish_year,
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
	
				// changed this line to make a POST request to /api/orders
				const response = await axios.post(`/api/orders`, orderToInsert);
	
				if(response.status === 201) {
					console.log("Order created successfully");
					navigate(`/thankYou/${userId}`)
					
				} else {
					console.error("Error creating order");
				}
	
				console.log("Payment successful");
			}
		}
	}


	const cardStyle = {
		style: {
		base: {
			color: '#ffffff',
			'::placeholder': {
			color: '#abcdef', 
			},
		},
		invalid: {
			color: '#fa755a',
			iconColor: '#fa755a',
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

	const totals = calculateTotals();

	return (
			<>
				<div>
					<p>Enter a credit card: (Note: Again, this is just to mock credit card transactions. <span>Do not use a read credit card number.</span> Instead please use the following credit card number: 4242 4242 4242 4242, 05/39, 123 (CSV))</p>
					<form onSubmit={handleSubmit} >
						<CardElement options={cardStyle} />
						<button type="submit">Submit Payment</button>
					</form>
				</div>

				<div style={{display: 'flex'}}>
					{cartItems.length > 0 ? (
					<>
						<ul>
						{/* <ul style={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap'}}> */}
							{cartItems.map((book, index) => (
							<li key={index}>
								<h2>{book.title}</h2>
								<h3>Author: {book.author.join(', ')}</h3>
								<p>First published year: {book.first_publish_year}</p>
								<p>Price: ${book.price}</p>
							</li>
							
							))}
						</ul>

						<div>
							{/* display the cart information */}
							<p>Pre-tax total: ${totals.preTaxTotal}</p>
							<p>Sales tax (6%): ${totals.salesTax}</p>
							<p>Shipping Cost: ${totals.shippingCost}</p>
							<hr />
							<p>Total with tax and shipping: ${totals.totalWithTaxAndShipping}</p>
						</div>
					</>
				) : (
					<p>Your shopping cart is empty.</p>
				)}

				</div>

			</>
		);
	}

	export default CheckoutFormInner;
