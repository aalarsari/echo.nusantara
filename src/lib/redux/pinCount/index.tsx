import { PinCount } from "@/controller/noAuth/pinCount";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface pinCount {
  wishlist?: number;
  cart?: number;
}

const initialState: pinCount = {
  wishlist: undefined,
  cart: undefined,
};
export const PinSlice = createSlice({
  name: "pin",
  initialState,
  reducers: {
    incrementWishlist: (state, action: PayloadAction<number>) => {
      state.wishlist! += action.payload;
    },
    decrementWishlist: (state, action: PayloadAction<number>) => {
      state.wishlist! -= action.payload;
    },
    incrementCart: (state, action: PayloadAction<number>) => {
      state.cart! += action.payload;
    },
    decrementCart: (state, action: PayloadAction<number>) => {
      state.cart! -= action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchCount.pending, (state) => {});
    builder.addCase(
      fetchCount.fulfilled,
      (state, action: PayloadAction<pinCount>) => {
        state.cart = action.payload.cart;
        state.wishlist = action.payload.wishlist;
      },
    );
    builder.addCase(fetchCount.rejected, (state, action) => {
      console.error(action.error.message);
    });
  },
});

export const fetchCount = createAsyncThunk("pin/count-pin", async () => {
  const response = await PinCount();
  var body = await response.json();
  return body.data;
});

export const {
  incrementCart,
  incrementWishlist,
  decrementCart,
  decrementWishlist,
} = PinSlice.actions;
export const pinReducer = PinSlice.reducer;
