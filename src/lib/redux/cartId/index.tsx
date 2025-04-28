import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartId {
  cartId: number[] | null;
}

const initialState: CartId = {
  cartId: null,
};

export const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartId: (state, action: PayloadAction<number[]>) => {
      state.cartId = action.payload;
    },
  },
});

export const { setCartId } = CartSlice.actions;
export const cartReducer = CartSlice.reducer;
