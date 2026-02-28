import api from '@/utils/axios'
import { handleError } from '@/utils/handle-error'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'sonner'

export const getNotifications = createAsyncThunk(
  'notifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/notification')

      const { data } = response.data
      return data.map(n => ({
        ...n,
        unread: !n.isRead,
        isToday: new Date(n.createdAt).toDateString() === new Date().toDateString()
      }))
    } catch (error) {
      const message = handleError(error)
      return rejectWithValue(message)
    }
  },
)

export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (data, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`/notification/${data}`)
      await dispatch(getNotifications()).unwrap()
      toast.success('Xóa thành công')
    } catch (error) {
      const message = handleError(error)
      return rejectWithValue(message)
    }
  },
)

export const createNotification = createAsyncThunk(
  'notifications/create',
  async (data, { rejectWithValue, dispatch }) => {
    try {
      await api.post('/notification', data)

      await dispatch(getNotifications()).unwrap()
      toast.success('Thêm mới thành công')
    } catch (error) {
      const message = handleError(error)
      return rejectWithValue(message)
    }
  },
)

export const updateNotification = createAsyncThunk(
  'notifications/update',
  async (updateData, { rejectWithValue, dispatch }) => {
    try {
      await api.put(`/notification/${updateData.id}`, updateData)
      await dispatch(getNotifications()).unwrap()
      toast.success('Cập nhật dữ liệu thành công')
    } catch (error) {
      console.log('error', error)
      const message = handleError(error)
      return rejectWithValue(message)
    }
  },
)

export const readNotification = createAsyncThunk(
  'notification/read',
  async (id, { rejectWithValue }) => {
    try {
      await api.put(`/notification/${id}/read`)
      return { id }
    } catch (error) {
      console.log('error', error)
      const message = handleError(error)
      return rejectWithValue(message)
    }
  },
)

const initialState = {
  notifications: [],
  loading: false,
  error: null,
}

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    markLocalRead(state, action) {
      const id = action.payload
      const n = state.notifications.find((x) => x.id === id)
      if (n && n.isToday && n.unread) {
        n.unread = false
        n.isRead = true
        n.readAt = new Date().toISOString()
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNotification.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createNotification.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message || 'Lỗi không xác định'
        toast.error(state.error)
      })
      .addCase(getNotifications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false
        state.notifications = action.payload
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message || 'Lỗi không xác định'
        toast.error(state.error)
      })
      .addCase(deleteNotification.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message || 'Lỗi không xác định'
        toast.error(state.error)
      })
      .addCase(updateNotification.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateNotification.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(updateNotification.rejected, (state, action) => {
        state.loading = false
        state.error = action?.payload?.message || 'Lỗi không xác định'
        toast.error(state.error)
      })
      .addCase(readNotification.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(readNotification.fulfilled, (state, action) => {
        state.loading = false
        const id = action.payload.id
        const n = state.notifications.find((x) => x.id === id)
        if (n) {
          n.unread = false
          n.isRead = true
          if (!n.readAt) n.readAt = new Date().toISOString()
        }
      })
      .addCase(readNotification.rejected, (state, action) => {
        state.loading = false
        state.error = action?.payload?.message || 'Lỗi không xác định'
        toast.error(state.error)
      })
  },
})

export const { markLocalRead } = notificationSlice.actions
export default notificationSlice.reducer
