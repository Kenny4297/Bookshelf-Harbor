import React from 'react';
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';

export function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // this is where you would normally call your server to create a payment intent
    // and then confirm the payment using stripe.confirmCardPayment
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit">Submit Payment</button>
    </form>
  );
}
