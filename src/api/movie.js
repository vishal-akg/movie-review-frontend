import axios from './axios-instance'
import statelessAxios from 'axios'

// export const uploadTrailer = async (formData, callbacks) => {
//   const controller = new AbortController()

//   callbacks.cancel = () => controller.abort()

//   return axios.post(`/movies/upload-trailer`, formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//     onUploadProgress: (progressEvent) => {
//       if (progressEvent.loaded === progressEvent.total) {
//         callbacks.onComplete(100)
//       } else {
//         const percentage = Math.round(
//           (progressEvent.loaded / progressEvent.total) * 100,
//         )
//         callbacks.onProgress(percentage)
//       }
//     },
//     signal: controller.signal,
//   })
// }

export const create = async (data) => axios.post(`/movies`, data)

export const update = async (id, data) => axios.patch(`/movies/${id}`, data)

export const deleteMovie = async (id) => axios.delete(`/movies/${id}`)

export const getSignedUrl = async (name, size, type) =>
  axios.post('/movies/signature', { name, size, type })

export const allMovies = async (skip, limit) =>
  axios.get('/movies', { params: { skip, limit } })

export const getMostRatedMovies = async (type) =>
  axios.get('/movies/most-rated', { params: { type } })
export const getMovieDetails = async (id) => axios.get(`/movies/${id}/details`)
export const getRelatedMovies = async (id) =>
  axios.get(`/movies/${id}/related-movies`)

export const getLatestMovies = async () => axios.get(`/movies/latest`)

export const postReview = async (movieId, data) =>
  axios.post(`/movies/${movieId}/reviews`, data)

export const updateReview = async (movieId, reviewId, data) =>
  axios.patch(`/movies/${movieId}/reviews/${reviewId}`, data)

export const deleteReview = async (movieId, reviewId) =>
  axios.delete(`/movies/${movieId}/reviews/${reviewId}`)

export const getMovieReviews = async (movieId) =>
  axios.get(`/movies/${movieId}/reviews`)

export const uploadPoster = async ({
  file,
  api_key,
  timestamp,
  public_id,
  signature,
}) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('api_key', api_key)
  formData.append('timestamp', timestamp)
  formData.append('public_id', public_id)
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

export const uploadTrailer = async ({
  file,
  api_key,
  timestamp,
  public_id,
  signature,
  callbacks,
}) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('api_key', api_key)
  formData.append('timestamp', timestamp)
  formData.append('public_id', public_id)
  formData.append('signature', signature)
  formData.append('resource_type', 'video')
  return statelessAxios.post(
    `http://api.cloudinary.com/v1_1/dopfwxs7h/video/upload`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      transformRequest: (data, headers) => {
        delete headers.common.Authorization
        return data
      },
      onUploadProgress: callbacks.progress || undefined,
    },
  )
}
