import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './features/counterSlice'
import restaurantReducer from './features/restaurantSlice'
import cartReducer from './features/cartSlice'



export const store = configureStore({
  reducer: {
    counter: counterReducer,
    restaurantData: restaurantReducer,
    cart: cartReducer
  },
})