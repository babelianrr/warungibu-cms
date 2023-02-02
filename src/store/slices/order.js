import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import serverAuthAPI from 'API/serverAuthAPI'
import {formatQueryString} from 'helpers/formatter'

export const fetchOrder = createAsyncThunk('/order/all', async (query) => {
  try {
    const queries = formatQueryString(query)
    const {data} = await serverAuthAPI({
      url: `/orders${queries}`,
      method: 'GET',
    })
    return data
  } catch (err) {
    return err
  }
})

const initialState = {
  data: [],
  isFetch: false,
  isLoading: true,
  isLoadingDetail: true,
  isError: false,
  error: null,
  totalPage: 0,
}

const productSlice = createSlice({
  name: 'order',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchOrder.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(fetchOrder.fulfilled, (state, action) => {
      state.data = action.payload.orders
      state.totalPage = action.payload.totalPage
      state.isFetch = true
      state.isLoading = false
    })
    builder.addCase(fetchOrder.rejected, (state, action) => {
      state.data = []
      state.isError = true
      state.error = action.response.data.errors
      state.isLoading = false
    })
  },
})

export const {resetDetail, setLoadingTrue} = productSlice.actions

export default productSlice.reducer
