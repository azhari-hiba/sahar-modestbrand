import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart(prev => {
      // البحث كيولي بـ ID و Size و Image (اللون)
      const exist = prev.find(
        p =>
          p.productId === item.productId &&
          p.size === item.size &&
          p.image === item.image
      );

      if (exist) {
        return prev.map(p => {
          if (
            p.productId === item.productId &&
            p.size === item.size &&
            p.image === item.image
          ) {
            const max = p.stockMax || 99; // حطيت 99 كافتراضي إذا ماكانش stockMax
            const newQty = Math.min(p.quantity + item.quantity, max);
            return { ...p, quantity: newQty };
          }
          return p;
        });
      }

      return [...prev, item];
    });
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, qty) => {
    setCart(prev =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const max = item.stockMax || 99;
        return {
          ...item,
          quantity: Math.max(1, Math.min(qty, max))
        };
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};