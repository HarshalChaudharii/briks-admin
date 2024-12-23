import axios, { axiosPrivate, axiosPrivateFormData } from './axios'

import Cookies from 'js-cookie'

let i = 1

interface ErrorResponse {
  response?: {
    data?: any
    status: number
  }
}

const handleError = (err: ErrorResponse): void => {
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

export const publicGetRequest = async (url: string): Promise<any> => {
  try {
    const response = await axios.get(url)
    return response
  } catch (error) {
    throw error
  }
}

interface PostRequestHeaders {
  [key: string]: string
}

export const publicPostRequest = async (
  url: string,
  data: any,
  headers: PostRequestHeaders
): Promise<any> => {
  try {
    const response = await axios.post(url, data, headers)
    return response
  } catch (error) {
    throw error
  }
}

interface PutRequestData {
  [key: string]: any
}

export const publicPutRequest = async (
  url: string,
  data: PutRequestData
): Promise<any> => {
  try {
    const response = await axios.put(url, data)
    return response
  } catch (error) {
    throw error
  }
}

interface PrivateGetRequestHeaders {
  Authorization: string
  [key: string]: string
}

export const privateGetRequest = async (url: string): Promise<any> => {
  try {
    const token = Cookies.get('token')

    const headers: PrivateGetRequestHeaders = {
      Authorization: `Bearer ${token}`,
    }

    const response = await axios.get(url, { headers })
    return response
  } catch (error) {
    handleError(error as ErrorResponse)
  }
}

export const privatePostRequest = async (
  url: string,
  data: any
): Promise<any> => {
  try {
    const response = await axiosPrivate.post(url, data)
    return response
  } catch (error) {
    handleError(error as ErrorResponse)
  }
}

interface PrivatePostRequestFormData {
  [key: string]: any
}

export const privatePostRequestFormData = async (
  url: string,
  data: PrivatePostRequestFormData
): Promise<any> => {
  try {
    const response = await axiosPrivateFormData.post(url, data)
    return response
  } catch (error) {
    handleError(error as ErrorResponse)
  }
}

interface PrivatePutRequestData {
  [key: string]: any
}

export const privatePutRequest = async (
  url: string,
  data: PrivatePutRequestData
): Promise<any> => {
  try {
    const response = await axiosPrivate.put(url, data)
    return response
  } catch (error) {
    handleError(error as ErrorResponse)
  }
}

interface PrivatePutRequestFormData {
  [key: string]: any
}

export const privatePutRequestFormData = async (
  url: string,
  data: PrivatePutRequestFormData
): Promise<any> => {
  try {
    const response = await axiosPrivateFormData.put(url, data)
    return response
  } catch (error) {
    handleError(error as ErrorResponse)
  }
}

interface PrivatePatchRequestData {
  [key: string]: any
}

export const privatePatchRequest = async (
  url: string,
  data: PrivatePatchRequestData
): Promise<any> => {
  try {
    const response = await axiosPrivate.patch(url, data)
    return response
  } catch (error) {
    handleError(error as ErrorResponse)
  }
}

interface PrivateDeleteRequestResponse {
  data: any
}

export const privateDeleteRequest = async (
  url: string
): Promise<PrivateDeleteRequestResponse | undefined> => {
  try {
    const response = await axiosPrivate.delete(url)
    return response
  } catch (error) {
    handleError(error as ErrorResponse)
    return undefined
  }
}

interface Headers {
  headers: {
    'Content-Type': string
  }
}

export const getHeaders = (type: string): Headers | undefined => {
  if (type && type === 'multipart') {
    return {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  }
}
