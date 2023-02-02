import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import serverAuthAPI from 'API/serverAuthAPI'

export const login = createAsyncThunk('/auth/login', async (payload, {rejectWithValue}) => {
  try {
    const {data} = await serverAuthAPI({
      url: `/users/login_email`,
      method: 'POST',
      data: payload,
    })
    localStorage.setItem('user', data.user)
    localStorage.setItem('token', data.token)

    return data
  } catch (err) {
    console.log(err, 'internal server error')
    return rejectWithValue(err.response.data)
  }
})

const initialState = {
  data: {},
  isFetch: false,
  isLoading: true,
  isError: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    signout: (state) => {
      state.isLoading = true
      state.data = {}
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      state.isLoading = false
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(login.fulfilled, (state, action) => {
      state.data = action.payload.user
      state.isFetch = true
      state.isLoading = false
      state.isError = false
      state.error = null
    })
    builder.addCase(login.rejected, (state, action) => {
      state.data = []
      state.isError = true

      if (action.payload.errorCode === 'CAN_NOT_LOGIN') {
        state.error = action.payload.message
      } else {
        state.error = 'Error, silahkan hubungi teknisi'
      }

      state.isLoading = false
    })
  },
})

export const {signout} = authSlice.actions
export default authSlice.reducer
