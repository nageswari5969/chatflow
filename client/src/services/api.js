import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
})

// Attach Clerk token to every request
api.interceptors.request.use(async (config) => {
  try {
    // Clerk token injected via window.__clerk if available
    if (window.__clerk_token) {
      config.headers.Authorization = `Bearer ${window.__clerk_token}`
    }
  } catch (e) {
    // ignore
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || err.message || 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

export default api
