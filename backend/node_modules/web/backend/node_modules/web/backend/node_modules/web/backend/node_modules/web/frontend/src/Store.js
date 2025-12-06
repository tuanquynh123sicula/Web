import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
const initialState = {
    loading: false,
    error: null,
    products: [],
    userInfo: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null,
    mode: localStorage.getItem('mode')
        ? localStorage.getItem('mode')
        : window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light',
    cart: {
        cartItems: localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems'))
            : [],
        shippingAddress: localStorage.getItem('shippingAddress')
            ? JSON.parse(localStorage.getItem('shippingAddress'))
            : { location: {} },
        paymentMethod: localStorage.getItem('paymentMethod')
            ? localStorage.getItem('paymentMethod')
            : 'vnPay',
        itemsPrice: 0,
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: 0,
    },
};
function reducer(state, action) {
    switch (action.type) {
        case 'SWITCH_MODE':
            localStorage.setItem('mode', state.mode === 'dark' ? 'light' : 'dark');
            return { ...state, mode: state.mode === 'dark' ? 'light' : 'dark' };
        case 'CART_ADD_ITEM': {
            const newItem = action.payload;
            const existItem = state.cart.cartItems.find((item) => item._id === newItem._id);
            const cartItems = existItem
                ? state.cart.cartItems.map((item) => item._id === existItem._id ? newItem : item)
                : [...state.cart.cartItems, newItem];
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            return { ...state, cart: { ...state.cart, cartItems } };
        }
        case 'CART_REMOVE_ITEM': {
            const cartItems = state.cart.cartItems.filter((item) => item._id !== action.payload._id);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            return { ...state, cart: { ...state.cart, cartItems } };
        }
        case 'CART_CLEAR':
            return { ...state, cart: { ...state.cart, cartItems: [] } };
        case 'USER_SIGNIN':
            return { ...state, userInfo: action.payload };
        case 'USER_SIGNOUT':
            return {
                loading: false,
                error: null,
                products: [],
                mode: window.matchMedia &&
                    window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? 'dark'
                    : 'light',
                cart: {
                    cartItems: [],
                    paymentMethod: 'PayPal',
                    shippingAddress: {
                        fullName: '',
                        address: '',
                        postalCode: '',
                        city: '',
                        country: '',
                    },
                    itemsPrice: 0,
                    shippingPrice: 0,
                    taxPrice: 0,
                    totalPrice: 0,
                }
            };
        case 'SAVE_SHIPPING_ADDRESS':
            return {
                ...state,
                cart: {
                    ...state.cart,
                    shippingAddress: action.payload,
                },
            };
        case 'SAVE_PAYMENT_METHOD':
            return {
                ...state,
                cart: { ...state.cart, paymentMethod: action.payload },
            };
        default:
            return state;
    }
}
const defaultDispatch = () => initialState;
const Store = React.createContext({
    state: initialState,
    dispatch: defaultDispatch,
});
function StoreProvider(props) {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    return _jsx(Store.Provider, { value: { state, dispatch }, ...props });
}
export { Store, StoreProvider };
