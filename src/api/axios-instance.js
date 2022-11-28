import axios from 'axios'
const BASE_URL = 'http://localhost:3000/v1/api'

const instance = axios.create({
  baseURL: BASE_URL,
})

export default instance
