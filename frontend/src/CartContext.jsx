import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    // Frontend state update
    setCartItems([...cartItems, product]);
    
    // Backend update (Jo aapne JSON diya hai, us user ID ka use karein)
    // axios.post(`http://localhost:5000/api/cart/add`, { userId: 6, productId: product.id });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};