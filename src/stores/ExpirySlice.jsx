import api from '@/utils/axios'
import { handleError } from '@/utils/handle-error'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'sonner'

export const getExpiry = createAsyncThunk(
  'expiry',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/expiry')

      const { data } = response.data
      return data
    } catch (error) {
      const message = handleError(error)
      return rejectWithValue(message)
    }
  },
)

export const deleteExpiry = createAsyncThunk(
  'expiry/delete',
  async (data, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`/expiry/${data}`)
      await dispatch(getExpiry({ page: 1, limit: 30 })).unwrap()
      toast.success('Xóa thành công')
    } catch (error) {
      const message = handleError(error)
      return rejectWithValue(message)
    }
  },
)

export const deleteAccount = createAsyncThunk(
  'expiry/account/delete',
  async (accountId, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`/expiry/account/${accountId}`)
      await dispatch(getExpiry({ page: 1, limit: 30 })).unwrap()
      toast.success('Xóa thành công')
    } catch (error) {
      const message = handleError(error)
      return rejectWithValue(message)
    }
  },
)

export const createExpiry = createAsyncThunk(
  'expiry/create',
  async (data, { rejectWithValue, dispatch }) => {
    try {
      await api.post('/expiry', data)

      await dispatch(getExpiry({ page: 1, limit: 30 })).unwrap()
      toast.success('Thêm mới thành công')
    } catch (error) {
      const message = handleError(error)
      return rejectWithValue(message)
    }
  },
)

export const updateExpiry = createAsyncThunk(
  'expiry/update',
  async (updateData, { rejectWithValue, dispatch }) => {
    try {
      await api.put(`/expiry/${updateData?.expiryId}`, updateData)
      await dispatch(getExpiry({ page: 1, limit: 30 })).unwrap()
      toast.success('Cập nhật dữ liệu thành công')
    } catch (error) {
      console.log('error', error)
      const message = handleError(error)
      return rejectWithValue(message)
    }
  },
)

export const getExpiriesByCustomerId = createAsyncThunk(
  'expiry/getExpiriesByCustomerId',
  async ({ customerId, page = 1, limit = 30 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/expiry/customer/${customerId}`, {
        params: {
          page,
          limit,
        },
      })
      return response.data
    } catch (error) {
      const message = handleError(error)
      return rejectWithValue(message)
    }
  },
)

const initialState = {
  expiry: {},
  expiries: [],
  customerAccounts: {},
  loading: false,
  error: null,
}

export const expirySlice = createSlice({
  name: 'expiry',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createExpiry.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createExpiry.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(createExpiry.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message || 'Lỗi không xác định'
        toast.error(state.error)
      })
      .addCase(getExpiry.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getExpiry.fulfilled, (state, action) => {
        state.loading = false
        state.expiries = action.payload
      })
      .addCase(getExpiry.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message || 'Lỗi không xác định'
        toast.error(state.error)
      })
      .addCase(deleteExpiry.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(deleteExpiry.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message || 'Lỗi không xác định'
        toast.error(state.error)
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message || 'Lỗi không xác định'
        toast.error(state.error)
      })
      .addCase(updateExpiry.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateExpiry.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(updateExpiry.rejected, (state, action) => {
        state.loading = false
        state.error = action?.payload?.message || 'Lỗi không xác định'
        toast.error(state.error)
      })
      .addCase(getExpiriesByCustomerId.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getExpiriesByCustomerId.fulfilled, (state, action) => {
        state.loading = false
        state.customerAccounts = action.payload
      })
      .addCase(getExpiriesByCustomerId.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message || 'Lỗi không xác định'
        toast.error(state.error)
      })
  },
})

export default expirySlice.reducer
