import { configureStore } from '@reduxjs/toolkit'
import restaurantReducer from './features/restaurantSlice'
import cartReducer from './features/cartSlice'



export const store = configureStore({
  reducer: {
    restaurantData: restaurantReducer,
    cart: cartReducer
  },
})