import api from '@/utils/axios'
import { handleError } from '@/utils/handle-error'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'sonner'

// GET /crm/customers/:customerId/timeline
export const getCustomerTimeline = createAsyncThunk(
  'customerTimeline/timeline',
  async ({ customerId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/crm/customers/${customerId}/timeline`, {
        params,
      })
      const { data } = response.data // { customerId, items: [...] }
      return data
    } catch (error) {
      const message = handleError(error)
      return rejectWithValue(message)
    }
  },
)

// GET /crm/customers/:customerId/overview
export const getCustomerOverview = createAsyncThunk(
  'customerTimeline/overview',
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/crm/customers/${customerId}/overview`)
      const { data } = response.data // { customerId, openTickets, pendingTasks, lastCare }
      return data
    } catch (error) {
      const message = handleError(error)
      return rejectWithValue(message)
    }
  },
)

const initialState = {
  // Timeline
  timeline: {
    customerId: null,
    items: [],
  },
  // Overview
  overview: {
    customerId: null,
    openTickets: 0,
    pendingTasks: 0,
    lastCare: null,
  },
  loadingTimeline: false,
  loadingOverview: false,
  error: null,
}

export const customerTimelineSlice = createSlice({
  name: 'customerTimeline',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ===== Timeline =====
      .addCase(getCustomerTimeline.pending, (state) => {
        state.loadingTimeline = true
        state.error = null
      })
      .addCase(getCustomerTimeline.fulfilled, (state, action) => {
        state.loadingTimeline = false
        state.timeline = {
          customerId: action.payload?.customerId || null,
          items: action.payload?.items || [],
        }
      })
      .addCase(getCustomerTimeline.rejected, (state, action) => {
        state.loadingTimeline = false
        const errorMessage =
          action.payload?.message || action.payload || 'Lỗi không xác định'
        state.error = errorMessage
        toast.error(errorMessage)
      })

      // ===== Overview =====
      .addCase(getCustomerOverview.pending, (state) => {
        state.loadingOverview = true
        state.error = null
      })
      .addCase(getCustomerOverview.fulfilled, (state, action) => {
        state.loadingOverview = false
        state.overview = {
          customerId: action.payload?.customerId || null,
          openTickets: action.payload?.openTickets ?? 0,
          pendingTasks: action.payload?.pendingTasks ?? 0,
          lastCare: action.payload?.lastCare || null,
        }
      })
      .addCase(getCustomerOverview.rejected, (state, action) => {
        state.loadingOverview = false
        const errorMessage =
          action.payload?.message || action.payload || 'Lỗi không xác định'
        state.error = errorMessage
        toast.error(errorMessage)
      })
  },
})

export default customerTimelineSlice.reducer
