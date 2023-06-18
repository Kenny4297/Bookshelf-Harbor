export const calculateSalesTax = (cartItems) => {
    const taxRate = 0.06; // 6% sales tax
    const totalPrice = cartItems.reduce((total, book) => total + book.price, 0);
    return totalPrice * taxRate;
  };
  
  export const calculateTotalWithoutTax = (cartItems) => {
    return cartItems.reduce((total, book) => total + book.price, 0);
  };
  
  export const calculateTotalWithTaxAndShipping = (cartItems) => {
    const shippingCostPerBook = 5; // $5 shipping cost per book
    const totalPrice = calculateTotalWithoutTax(cartItems);
    const tax = calculateSalesTax(cartItems);
    const shippingCost = cartItems.length * shippingCostPerBook;
    return totalPrice + tax + shippingCost;
  };
  
  export const calculateShippingCost = (cartItems) => {
    const shippingCostPerBook = 5; // $5 shipping cost per book
    return cartItems.length * shippingCostPerBook;
  };