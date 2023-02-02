import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import serverAuthAPI from 'API/serverAuthAPI'

export const fetchCategories = createAsyncThunk('/admin/categories/all', async () => {
  try {
    const {data} = await serverAuthAPI({
      url: `/admin/categories`,
      method: 'GET',
    })
    return data
  } catch (err) {
    return err
  }
})

export const fetchCategoryById = createAsyncThunk('/admin/categories/:id', async (categoryId, thunkAPI) => {
  try {
    const {data} = await serverAuthAPI({
      url: `/admin/categories/${categoryId}`,
      method: 'GET',
    })
    return data
  } catch (err) {
    return err
  }
})

const initialState = {
  data: [],
  detail: {},
  isFetch: false,
  isLoading: true,
  isLoadingDetail: true,
  isError: false,
  error: null,
}

const categorySlice = createSlice({
  name: 'category',
  initialState: initialState,
  reducers: {
    resetDetail(state) {
      state.detail = {}
      state.isLoadingDetail = true
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.data = action.payload
      state.isFetch = true
      state.isLoading = false
    })
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.data = []
      state.isError = true
      state.error = action.response.data.errors
      state.isLoading = false
    })

    builder.addCase(fetchCategoryById.pending, (state, action) => {
      state.isLoadingDetail = true
    })
    builder.addCase(fetchCategoryById.fulfilled, (state, action) => {
      state.detail = action.payload
      state.isFetch = true
      state.isLoadingDetail = false
    })
    builder.addCase(fetchCategoryById.rejected, (state, action) => {
      state.detail = {}
      state.isError = true
      state.error = action.response.data.errors
      state.isLoadingDetail = false
    })
  },
})

export default categorySlice.reducer
