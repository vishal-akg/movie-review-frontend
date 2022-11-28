import axios from './axios-instance'
import statelessAxios from 'axios'

export const create = async (data) => axios.post('/actors', data)

export const update = async (id, data) => axios.patch(`/actors/${id}`, data)

export const getActorDetails = async (id) => axios.get(`/actors/${id}`)

export const search = async (name) =>
  axios.get('/actors/search', { params: { name } })

export const all = async (skip, limit) =>
  axios.get('/actors', { params: { skip, limit } })

export const getSignedUrl = async (name, size, type) =>
  axios.post('/actors/avatar/signature', { name, size, type })

export const uploadAvatar = async ({
  file,
  api_key,
  timestamp,
  public_id,
  signature,
  eager,
}) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('api_key', api_key)
  formData.append('timestamp', timestamp)
  formData.append('public_id', public_id)
  formData.append('eager', eager)
  formData.append('signature', signature)
  return statelessAxios.post(
    `http://api.cloudinary.com/v1_1/dopfwxs7h/image/upload`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      transformRequest: (data, headers) => {
        delete headers.common.Authorization
        return data
      },
    },
  )
}
