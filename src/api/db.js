import request from '@/utils/request'

export const fetchList = (query) => {
  return request({
    url: '/api/resource',
    method: 'get',
    params: query
  })
}

export const testDb = (params) => {
  return request({
    url: '/api/resource',
    method: 'post',
    params
  })
}

export const addDb = (params) => {
  return request({
    url: 'api/resource',
    method: 'post',
    params
  })
}

export const updateDb = (params) => {
  return request({
    url: 'api/resource',
    method: 'patch',
    params
  })
}

export const deleteDb = (query) => {
  return request({
    url: 'api/resource',
    method: 'delete',
    params: query
  })
}

export const metaData = (query) => {
  return request({
    url: 'api/schedule/meta',
    method: 'get',
    params: query
  })
}

export const addSchedule = (params) => {
  return request({
    url: 'api/schedule',
    method: 'post',
    params
  })
}

export const getScheduleData = (query) => {
  return request({
    url: 'api/schedule',
    method: 'get',
    params: query
  })
}

export const getScheduleLogData = (query) => {
  return request({
    url: 'api/schedule_log',
    method: 'get',
    params: query
  })
}
