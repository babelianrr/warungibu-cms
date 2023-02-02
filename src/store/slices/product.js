import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import serverAuthAPI from 'API/serverAuthAPI'
import {formatQueryString} from 'helpers/formatter'

export const fetchProducts = createAsyncThunk('/admin/products/all', async (query, thunkAPI) => {
  try {
    const queries = formatQueryString(query)
    const {data} = await serverAuthAPI({
      url: `/admin/products${queries}`,
      method: 'GET',
    })
    return data
  } catch (err) {
    return err
  }
})

export const fetchProductById = createAsyncThunk('/admin/products/:id', async (productId, thunkAPI) => {
  try {
    const {data} = await serverAuthAPI({
      url: `/admin/products/${productId}`,
      method: 'GET',
    })
    return data
  } catch (err) {
    return err
  }
})

const initialState = {
  data: [],
  detail: {
    images: [],
  },
  isFetch: false,
  isLoading: true,
  isLoadingDetail: true,
  isError: false,
  error: null,
  totalPage: 0,
}

const productSlice = createSlice({
  name: 'product',
  initialState: initialState,
  reducers: {
    resetDetail(state) {
      state.detail = {
        images: [],
      }
      state.isLoadingDetail = true
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.data = action.payload.products
      state.totalPage = action.payload.totalPage
      state.isFetch = true
      state.isLoading = false
      state.isError = false
      state.error = null
    })
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.data = []
      state.isError = true
      state.error = action.response.data.errors
      state.isLoading = false
    })

    builder.addCase(fetchProductById.pending, (state, action) => {
      state.isLoadingDetail = true
    })
    builder.addCase(fetchProductById.fulfilled, (state, action) => {
      state.detail = action.payload
      state.isFetch = true
      state.isLoadingDetail = false
      state.isError = false
      state.error = null
    })
    builder.addCase(fetchProductById.rejected, (state, action) => {
      state.detail = {
        images: [],
      }
      state.isError = true
      state.error = action.response.data.errors
      state.isLoadingDetail = false
    })
  },
})

export const {resetDetail, setLoadingTrue} = productSlice.actions

export default productSlice.reducer
