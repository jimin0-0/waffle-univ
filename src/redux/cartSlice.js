import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { cartItems: [] },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.cartItems.find(cartItem => cartItem.id === item.id);
      if (existing) {
        existing.quantity += item.quantity || 1;
      } else {
        state.cartItems.push({ ...item, quantity: item.quantity || 1 });
      }
    },
    changeQuantity: (state, action) => {
      const { id, delta } = action.payload;
      const item = state.cartItems.find(cartItem => cartItem.id === id);
      if (item) item.quantity = Math.max(1, item.quantity + delta);
    },
    removeItem: (state, action) => {
      state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const { addToCart, changeQuantity, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
