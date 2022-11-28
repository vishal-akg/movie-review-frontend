import axios from './axios-instance'

export const login = async (email, password) =>
  axios.post('/auth/login', { email, password })

export const signup = async (name, email, password) =>
  axios.post('/auth/sign-up', { name, email, password })

export const verifyEmail = async (OTP, userId) =>
  axios.post('/auth/verify-email', { OTP, userId })

export const forgotPassword = async (email) =>
  axios.post('/auth/forgot-password', { email })

export const resetPassword = async (token, userId, password) =>
  axios.post('/auth/reset-password', { token, userId, password })

export const resendEmailVerificationToken = async () =>
  axios.post('/auth/resend-email-verification-otp')
