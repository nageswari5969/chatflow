export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
export const isValidPassword = (pwd) => pwd.length >= 8
export const isNotEmpty = (val) => val?.trim().length > 0
