import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  restaurant: [],
}

export const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    fetchRestaurantData : (state, action) => {
      state.restaurant = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { fetchRestaurantData } = restaurantSlice.actions

export default restaurantSlice.reducer