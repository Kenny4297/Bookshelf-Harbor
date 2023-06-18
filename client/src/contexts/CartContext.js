import { createContext } from "react";

export const CartContext = createContext({
  cartItemsContext: [],
  calculateTotalWithoutTax: () => {},
  calculateSalesTax: () => {},
  calculateShippingCost: () => {},
  calculateTotalWithTaxAndShipping: () => {},
});