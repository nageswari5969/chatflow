import api from './api'

export const searchUsers = (query) => api.get(`/users/search?q=${query}`)
export const getUserProfile = (userId) => api.get(`/users/${userId}`)
export const updateProfile = (data) => api.put('/users/profile', data)
export const getOnlineUsers = () => api.get('/users/online')
export const blockUser = (userId) => api.post(`/users/${userId}/block`)
export const unblockUser = (userId) => api.delete(`/users/${userId}/block`)
