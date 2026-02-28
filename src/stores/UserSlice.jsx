import api from '@/utils/axios'
import { handleError } from '@/utils/handle-error'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'sonner'
import { getAuthUserRolePermissions } from './AuthSlice'

export const getUsers = createAsyncThunk(
  'user',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user')
      const { data } = response.data
      return data
    } catch (error) {
      const message = handleError(error)
      return rejectWithValue(message)
    }
  },
)

export const deleteUser = createAsyncThunk(
  'user/delete',
  async (data, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`/user/${data}/delete`)
      await dispatch(getUsers()).unwrap()
      toast.success('Xóa thành công')
    } catch (error) {
      const message = handleError(error)
      return rejectWithValue(message)
    }
  },
)

export const createUser = createAsyncThunk(
  'user/create',
  async (data, { rejectWithValue, dispatch }) => {
    try {
      await api.post('/user/create', data)

      await dispatch(getUsers()).unwrap()
      toast.success('Thêm mới thành công')
    } catch (error) {
      const message = handleError(error)
      return rejectWithValue(message)
    }
  },
)

export const updateUser = createAsyncThunk(
  'user/update',
  async (updateData, { rejectWithValue, dispatch }) => {
    try {
      const { id, data } = updateData
      await api.put(`/user/${id}/update`, data)
      await dispatch(getUsers()).unwrap()
      toast.success('Cập nhật dữ liệu thành công')
    } catch (error) {
      const message = handleError(error)
      return rejectWithValue(message)
    }
  },
)

export const updateUserStatus = createAsyncThunk(
  'user/update-status',
  async (updateData, { rejectWithValue, dispatch }) => {
    try {
      const { id, data } = updateData
      await api.put(`/user/${id}/update-status`, data)
      await dispatch(getUsers()).unwrap()
      toast.success('Cập nhật trạng thái thành công')
    } catch (error) {
      const message = handleError(error)
      return rejectWithValue(message)
    }
  },
)

export const changePassword = createAsyncThunk(
  'user/change-password',
  async (data, { rejectWithValue }) => {
    try {
      await api.put('/user/change-password', data)
      toast.success('Cập nhật mật khẩu thành công')
    } catch (error) {
      const message = handleError(error)
      return rejectWithValue(message)
    }
  },
)

export const updateProfile = createAsyncThunk(
  'user/update-profile',
  async (data, { rejectWithValue, dispatch }) => {
    try {
      await api.put('/user/profile', data)
      await dispatch(getAuthUserRolePermissions()).unwrap()
      toast.success('Cập nhật thông')
    } catch (error) {
      const message = handleError(error)
      return rejectWithValue(message)
    }
  },
)

const initialState = {
  users: [],
  loading: false,
  error: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message || 'Lỗi không xác định'
        toast.error(state.error)
      })
      .addCase(createUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createUser.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message || 'Lỗi không xác định'
        toast.error(state.error)
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message || 'Lỗi không xác định'
        toast.error(state.error)
      })
      .addCase(updateUserStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUserStatus.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message || 'Lỗi không xác định'
        toast.error(state.error)
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message || 'Lỗi không xác định'
        toast.error(state.error)
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message || 'Lỗi không xác định'
        toast.error(state.error)
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message || 'Lỗi không xác định'
        toast.error(state.error)
      })
  },
})

export default userSlice.reducer
