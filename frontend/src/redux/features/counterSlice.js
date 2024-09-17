// import { createSlice } from '@reduxjs/toolkit'

// const initialState = {
//   value: 0,
// }

// export const counterSlice = createSlice({
//   name: 'counter',
//   initialState: {
//     items: {}
//   },
//   reducers: {
//     increment: (state, action) => {
//       const { item, quantity } = action.payload;
//       if (state.items[item._id]) {
//         state.items[item._id].quantity += quantity;
//       } else {
//         state.items[item._id] = { ...item, quantity };
//       }
//     },
//     decrement: (state, action) => {
//       const { item, quantity } = action.payload;
//       if (state.items[item._id] && state.items[item._id].quantity > quantity) {
//         state.items[item._id].quantity -= quantity;
//       } else {
//         delete state.items[item._id]; // remove the item when quantity is zero
//       }
//     }
//   }
// })

// // Action creators are generated for each case reducer function
// export const { increment, decrement } = counterSlice.actions

// export default counterSlice.reducer