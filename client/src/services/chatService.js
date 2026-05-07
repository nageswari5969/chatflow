import api from './api'

export const getConversations = () => api.get('/chats')
export const getMessages = (chatId, page = 1) => api.get(`/chats/${chatId}/messages?page=${page}`)
export const sendMessage = (chatId, data) => api.post(`/chats/${chatId}/messages`, data)
export const createConversation = (userId) => api.post('/chats', { userId })
export const markRead = (chatId) => api.put(`/chats/${chatId}/read`)
export const deleteMessage = (chatId, messageId) => api.delete(`/chats/${chatId}/messages/${messageId}`)
export const searchMessages = (query) => api.get(`/chats/search?q=${query}`)
