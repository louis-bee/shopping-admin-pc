import axios from "axios";
import router from "@/router";
import { message } from "antd";
import { refreshTokenAPI } from "@/apis/user";

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000
})

// 添加请求拦截器
request.interceptors.request.use((config)=> {
  const token = localStorage.getItem('token')
  if(token) {
    config.headers.Authorization = token
  }
  return config
}, (error)=> {
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(async (response)=> {
  // 2xx 范围内的状态码都会触发该函数
  if(response.data && response.data.data && response.data.data.token!==undefined) {
    localStorage.setItem('token', response.data.data.token)
  }
  if(response.data && response.data.data && response.data.data.refreshToken!==undefined) {
    localStorage.setItem('refreshToken', response.data.data.refreshToken)
  }
  if(response.data.status===401) {
    const refreshToken = localStorage.getItem('refreshToken')
    //刷新token
    const params = {
      refreshToken: refreshToken,
      userId: JSON.parse(localStorage.getItem('userInfo')).id
    }
    const resr = await refreshTokenAPI(params)
    if(resr.status===402) {  //防止长token过期后的死循环
      return
    }
    //重新请求
    response.config.headers.Authorization = localStorage.getItem('token')  //用新token
    const res = await request.request(response.config)
    return res
  }
  if(response.data.status===402) {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userInfo')
    message.warning('登录已过期，请重新登录')
    router.navigate('/')
  }
  // 对响应数据做点什么
  return response.data
}, (error)=> {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error)
})

export { request }