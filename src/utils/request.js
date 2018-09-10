import axios from 'axios'
import { Message } from 'element-ui'
import { bus } from '@/bus.js'

const service = axios.create({
  timeout: 5000
})

service.interceptors.request.use(config => {
  const jwt = localStorage.getItem('jwt')
  if (jwt) {
    config.headers['Authorization'] = 'Bearer ' + jwt
  } else {
    bus.$emit('goto', '/login')
  }
  return config
})

service.interceptors.response.use(response => {
  if (response.data && response.data.errcode) {
    if (parseInt(response.data.errcode) === 40001) {
      bus.$emit('goto', '/login')
    }
  }
  return response
}, error => {
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  })
  return Promise.reject(error)
})

export default service
