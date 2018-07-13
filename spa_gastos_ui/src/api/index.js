import axios from 'axios'

const API_URL = 'http://127.0.0.1:8000/api'

export function authenticate (userData) {
  return axios.post(`${API_URL}/auth/`, userData)
}

export function uploadFile (data, token) {
  let config = {
    headers: {
      'Authorization': `JWT ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  }

  return axios.post(`${API_URL}/upload/`, data, config)
}

export function createResource (data, token) {
  let config = {
    headers: {
      'Authorization': `JWT ${token}`
    }
  }

  return axios.post(`${API_URL}/gastos/`, data, config)
}

export function listResources (token, queryparams) {
  let config = {
    headers: {
      'Authorization': `JWT ${token}`
    },
    params: queryparams
  }

  return axios.get(`${API_URL}/gastos/`, config)
}

export function deleteResource (id, token) {
  let config = {
    headers: {
      'Authorization': `JWT ${token}`
    }
  }

  return axios.delete(`${API_URL}/gastos/${id}/`, config)
}
