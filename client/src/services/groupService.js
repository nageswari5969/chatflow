import api from './api'

export const getGroups = () => api.get('/groups')
export const createGroup = (data) => api.post('/groups', data)
export const getGroupMessages = (groupId, page = 1) => api.get(`/groups/${groupId}/messages?page=${page}`)
export const sendGroupMessage = (groupId, data) => api.post(`/groups/${groupId}/messages`, data)
export const addMembers = (groupId, userIds) => api.post(`/groups/${groupId}/members`, { userIds })
export const removeMember = (groupId, userId) => api.delete(`/groups/${groupId}/members/${userId}`)
export const updateGroup = (groupId, data) => api.put(`/groups/${groupId}`, data)
export const leaveGroup = (groupId) => api.post(`/groups/${groupId}/leave`)
export const deleteGroup = (groupId) => api.delete(`/groups/${groupId}`)
