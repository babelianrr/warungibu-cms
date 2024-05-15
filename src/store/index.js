import {configureStore} from '@reduxjs/toolkit'
import productReducer from './slices/product'
import categoryReducer from './slices/category'
import authReducer from './slices/auth'
import orderReducer from './slices/order'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    category: categoryReducer,
    order: orderReducer,
  },
})
