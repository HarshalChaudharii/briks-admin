import { BASE_URL } from './apiUrl'
import axios, { axiosPrivate, axiosPrivateFormData } from './axios'
import Cookies from 'js-cookie'
let i = 1

const handleError = (err) => {
  if (err.response?.data) {
    if (err.response.status === 403 || err.response.status === 401) {
      localStorage.removeItem('user_profile')
      if (i == 1) {
        alert('Session Timeout')
        i = 2
      }
      window.location.href = '/sign-in-2'
    } else {
      throw err
    }
  } else {
    throw err
  }
}

export const publicGetRequest = async (url) => {
  try {
    const response = await axios.get(url)
    return response
  } catch (error) {
    throw error
  }
}

export const publicPostRequest = async (url, data, headers) => {
  try {
    const response = await axios.post(url, data, headers)
    return response
  } catch (error) {
    throw error
  }
}

export const publicPutRequest = async (url, data) => {
  try {
    const response = await axios.put(url, data)
    return response
  } catch (error) {
    throw error
  }
}

export const privateGetRequest = async (url) => {
  try {
    // const token = localStorage.getItem('token')

    const token = Cookies.get('token')

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error) {
    handleError(error)
  }
}

export const privatePostRequest = async (url, data, headers = {}) => {
  try {
    const response = await axiosPrivate.post(url, data, headers)
    return response
  } catch (error) {
    handleError(error)
  }
}

export const privatePostRequestFormData = async (url, data) => {
  try {
    const response = await axiosPrivateFormData.post(url, data)
    return response
  } catch (error) {
    handleError(error)
  }
}

export const privatePutRequest = async (url, data) => {
  try {
    const response = await axiosPrivate.put(url, data)
    return response
  } catch (error) {
    handleError(error)
  }
}

export const privatePutRequestFormData = async (url, data) => {
  try {
    const response = await axiosPrivateFormData.put(url, data)
    return response
  } catch (error) {
    handleError(error)
  }
}

export const privatePatchRequest = async (url, data) => {
  try {
    const response = await axiosPrivate.patch(url, data)
    return response
  } catch (error) {
    handleError(error)
  }
}

export const privateDeleteRequest = async (url) => {
  try {
    const response = await axiosPrivate.delete(url)
    return response
  } catch (error) {
    handleError(error)
  }
}

export const getHeaders = (type) => {
  if (type && type == 'multipart') {
    return {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  }
}
