import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: 0,
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    items: {}
  },
  reducers: {
    increment: (state, action) => {
      const itemId = action.payload;
      if (state.items[itemId]) {
        state.items[itemId] += 1;
      } else {
        state.items[itemId] = 1;
      }
    },
    decrement: (state, action) => {
      const itemId = action.payload;
      if (state.items[itemId] && state.items[itemId] > 1) {
        state.items[itemId] -= 1;
      } else {
        delete state.items[itemId]; // remove the item when quantity is zero
      }
    }
  }
})

// Action creators are generated for each case reducer function
export const { increment, decrement } = counterSlice.actions

export default counterSlice.reducer