import api from '@/utils/axios'
import { handleError } from '@/utils/handle-error'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'sonner'

export const getWarranties = createAsyncThunk(
  'warranty/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/warranty')
      const { data } = response.data
      return data
    } catch (error) {
      const message = handleError(error)
      return rejectWithValue(message)
    }
  },
)

export const getWarrantyById = createAsyncThunk(
  'warranty/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/warranty/${id}`)
      const { data } = response.data
      return data
    } catch (error) {
      const message = handleError(error)
      return rejectWithValue(message)
    }
  },
)

export const deleteWarranty = createAsyncThunk(
  'warranty/deleteById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/warranty/${id}`)
      await dispatch(getWarranties())
      return ({ data } = response.data)
    } catch (error) {
      const message = handleError(error)
      return rejectWithValue(message)
    }
  },
)

export const updateWarrantyStatusById = createAsyncThunk(
  'warranty/updateStatusById',
  async ({ id, dataToSend }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(
        `/warranty/${id}/update-status`,
        dataToSend,
      )
      await dispatch(getWarranties())

      const { data } = response.data
      return data
    } catch (error) {
      const message = handleError(error)
      return rejectWithValue(message)
    }
  },
)

const initialState = {
  warranties: [],
  warranty: {},
  loading: false,
  error: null,
}

export const warrantySlice = createSlice({
  name: 'warranty',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getWarranties
      .addCase(getWarranties.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getWarranties.fulfilled, (state, action) => {
        state.loading = false
        state.warranties = action.payload
      })
      .addCase(getWarranties.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message || 'Lỗi không xác định'
        toast.error(state.error)
      })

      // getWarrantyById
      .addCase(getWarrantyById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getWarrantyById.fulfilled, (state, action) => {
        state.loading = false
        state.warranty = action.payload
      })
      .addCase(getWarrantyById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message || 'Lỗi không xác định'
        toast.error(state.error)
      })

      // deleteWarrantyById
      .addCase(deleteWarranty.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteWarranty.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(deleteWarranty.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message || 'Lỗi không xác định'
        toast.error(state.error)
      })

      // updateWarrantyStatusById
      .addCase(updateWarrantyStatusById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateWarrantyStatusById.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(updateWarrantyStatusById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message || 'Lỗi không xác định'
        toast.error(state.error)
      })
  },
})

export default warrantySlice.reducer
