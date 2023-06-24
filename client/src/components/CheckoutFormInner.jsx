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
import Loading from './Loading'

const CheckoutFormInner = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [user, setUser] = useContext(UserContext);
    const { userId } = useParams(); 
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false)
	const [billingDetails, setBillingDetails] = useState({
		firstName: '',
		lastName: '',
		address: '',
		billingAddress: '',
		expDate: '',
	  });
	  
	  const handleInputChange = (e) => {
		const { value, name } = e.target;
		setBillingDetails({
		  ...billingDetails,
		  [name]: value,
		});
	  };

    const getPaymentIntent = async () => {
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

    const clearShoppingCart = async () => {
        try {
            const response = await axios.post(`/api/user/${userId}/cart/clear`);
            if (response.status === 200) {
                console.log("Shopping cart cleared successfully");
				setCartItems([]); 
            }
        } catch (error) {
            console.error("Error clearing shopping cart: ", error);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

		setIsLoading(true);
    
        const clientSecret = await getPaymentIntent();
    
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        });
    
        if (result.error) {
            console.log(result.error.message);
			setIsLoading(false);
        } else {
            if (result.paymentIntent.status === 'succeeded') {
                const orderToInsert = {
                    user: user._id, 
                    books: cartItems.map(item => ({
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
    
                if(response.status === 201) {
                    console.log("Order created successfully");
					console.log("The response for creating the order:", response)
                    clearShoppingCart();
                    navigate(`/thankYou/${userId}`)
                } else {
                    console.error("Error creating order");
                }
    
				
                console.log("Payment successful");
            }
        }
		setIsLoading(false);
    }


	const cardStyle = {
		style: {
		base: {
			color: 'black',
			'::placeholder': {
			color: 'black', 
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
		console.log("This is the cartItems:", cartItems);
	});

	const totals = calculateTotals();

	return (
			<div className='checkout-container'>
				<h2 className="checkout-h2">Checkout</h2>
				<div className="credit-card-container">
					

					<div className="checkout-form-field">
					<form className="form-field" onSubmit={handleSubmit}>
						<div className="form-column">
						<label>
						First Name:
						<input 
							type="text" 
							name="firstName" 
							required 
							onChange={handleInputChange} 
							value={billingDetails.firstName}
							minLength={1}
							/>
						</label>

						<label>
							Last Name:
							<input 
							type="text" 
							name="lastName" 
							required 
							onChange={handleInputChange} 
							value={billingDetails.lastName}
							minLength={1}
							/>
						</label>

						<label>
							Address:
							<input 
							type="text" 
							name="address" 
							required 
							onChange={handleInputChange} 
							placeholder='Enter a fake address'
							value={billingDetails.address}
							minLength={1}
							/>
						</label>
						</div>
						<div className="form-column">
						<label>
							Billing Address:
							<input 
							type="text" 
							name="billingAddress" 
							placeholder='Enter a fake billing address'
							required 
							onChange={handleInputChange} 
							value={billingDetails.billingAddress}
							minLength={1}
							/>
						</label>
							<p className='checkout-warning'>Do not use a real credit card number. Please use the following:</p> 
							<p className='checkout-warning'>4242 4242 4242 4242, 05/39, 123</p>
							<CardElement options={cardStyle} />
						</div>
						<button type="submit">Submit Payment</button>
						{isLoading && <p style={{color:'black', marginLeft:'1rem'}}>Processing...</p>}
					</form>

					<div className="checkout-total-section">
							<p className="standard">Pre-tax total: <span className="generated">${totals.preTaxTotal}</span></p>
							<p className="standard">Sales tax (6%): <span className="generated">${totals.salesTax}</span></p>
							<p className="standard">Shipping Cost: <span className="generated">${totals.shippingCost}</span></p>
							<hr />
							<p className="standard">Total with tax and shipping: <span className="generated">${totals.totalWithTaxAndShipping}</span></p>
						</div>

						</div>
				</div>

				<div className="checkout-book-total-container">
					{cartItems.length > 0 ? (
					<>
						{/* <div className="checkout-individual-book-section"> */}
							<div className="checkout-individual-book-section">
								{cartItems.map((book, index) => (
								<div className="checkout-individual-book" key={index}>
									<h4>{book.title}</h4>
									<h5>{book.author.join(', ')}</h5>
									<img src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`} alt="cover" />
									<p>${book.price}</p>
								</div>
								
								))}
							</div>
						{/* </div> */}

						
					</>
				) : (
					<p>Your shopping cart is empty.</p>
				)}

				</div>

			</div>
		);
	}

	export default CheckoutFormInner;
