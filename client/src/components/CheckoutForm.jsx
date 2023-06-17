import React from 'react';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutFormInner from './CheckoutFormInner';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API);

function CheckoutForm() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutFormInner />
    </Elements>
  );
}

export default CheckoutForm;