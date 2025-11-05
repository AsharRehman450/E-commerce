import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set) => ({
      cartItems: [],
      addToCart: (newItem) =>
        set((state) => {
          const existingIndex = state.cartItems.findIndex(
            (item) =>
              item.id === newItem.id &&
              item.color === newItem.color &&
              item.size === newItem.size
          );

          if (existingIndex !== -1) {
            const updatedItems = [...state.cartItems];
            updatedItems[existingIndex].quantity += newItem.quantity || 1;
            return { cartItems: updatedItems };
          }

          return {
            cartItems: [
              ...state.cartItems,
              { ...newItem, quantity: newItem.quantity || 1 },
            ],
          };
        }),

      removeFromCart: (id, color, size) =>
        set((state) => ({
          cartItems: state.cartItems.filter(
            (item) =>
              item.id !== id || item.color !== color || item.size !== size
          ),
        })),

      clearCart: () => set({ cartItems: [] }),

      //  Increment quantity
      incrementQuantity: (id, color, size) =>
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === id && item.color === color && item.size === size
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        })),

      //  Decrement quantity
      decrementQuantity: (id, color, size) =>
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === id &&
            item.color === color &&
            item.size === size &&
            item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ),
        })),
    }),
    {
      name: "cart-storage", // storage key name in localStorage
    }
  )
);

export default useCartStore;
