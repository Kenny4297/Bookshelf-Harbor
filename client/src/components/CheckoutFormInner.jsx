import React, {useContext} from 'react';
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';
import { useParams } from 'react-router-dom';

function CheckoutFormInner() {
  const stripe = useStripe();
  const elements = useElements();
  const [user, setUser] = useContext(UserContext);
  const { userId } = useParams(); // Get userId from URL parameters


  const getPaymentIntent = async () => {
    // Replace with your server route that creates a payment intent.
    const response = await axios.post('http://localhost:3001/create-payment-intent', { amount: 1000 }); 
    return response.data.clientSecret;
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
            console.log("Payment successful");
        }
    }
  }

  const cardStyle = {
    style: {
      base: {
        color: '#ffffff',
        '::placeholder': {
          color: '#abcdef', // This is for placeholder color
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };

  return (
    <>
    <p>Test test?</p>
      <form onSubmit={handleSubmit} >
          <CardElement options={cardStyle} />
          <button type="submit">Submit Payment</button>
      </form>
    </>
  );
}

export default CheckoutFormInner;
