import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: {},
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {

        setCart: (state, action) => {
            state.cartItems = action.payload;
        },

        clearCart: (state) => {
            state.cartItems = {};
        }
    }
});

export const getTotalCartAmount = (state) => {

    let total = 0;

    for (const id in state.cart.cartItems) {

        const item = state.cart.cartItems[id];

        if (item?.food) {
            total += item.food.price * (item.quantity || 0);
        }
    }

    return total;
};

export const getTotalCartQuantity = (state) => {
    let qty = 0;

    for (const id in state.cart.cartItems) {
        qty += state.cart.cartItems[id]?.quantity || 0;
    }

    return qty;
};

export const { setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;