import axios from 'axios'
import { BASE_URL } from './apiUrl'

export default axios.create({
  baseURL: BASE_URL,
})

const getToken = () => {
  return localStorage.getItem('token')
}

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
})

export const axiosPrivateFormData = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'multipart/form-data',
  },
})
