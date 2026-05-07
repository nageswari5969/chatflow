import api from './api'

export const getCallHistory = () => api.get('/calls')
export const initiateCall = (data) => api.post('/calls', data)
export const endCall = (callId) => api.put(`/calls/${callId}/end`)
