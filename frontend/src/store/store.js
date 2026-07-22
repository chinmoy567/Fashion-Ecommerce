import { configureStore } from '@reduxjs/toolkit'
import customerAuthReducer from './slices/customerAuthSlice'
import adminAuthReducer from './slices/adminAuthSlice'
import cartReducer from './slices/cartSlice'
import productReducer from './slices/productSlice'
import orderReducer from './slices/orderSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    customerAuth: customerAuthReducer,
    adminAuth: adminAuthReducer,
    cart: cartReducer,
    products: productReducer,
    orders: orderReducer,
    ui: uiReducer,
  },
})

export default store
