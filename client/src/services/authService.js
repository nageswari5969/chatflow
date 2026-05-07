import api from './api'

export const syncUser = (userData) => api.post('/auth/sync', userData)
export const getMe = () => api.get('/auth/me')
