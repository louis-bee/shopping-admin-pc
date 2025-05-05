import { request } from "@/utils/request";

export function loginAPI(params) {
  return request({
    url:'api/login',
    method:'POST',
    data: params
  })
}

export function registerAPI(params) {
  return request({
    url:'api/register',
    method:'POST',
    data: params
  })
}

export function logoutAPI(params) {
  return request({
    url:'api/logout',
    method:'POST',
    data: params
  })
}

export async function refreshTokenAPI(params) {
  return request({
    url:'api/refreshToken',
    method:'POST',
    data: params
  })
}

export async function sendAdminCodeAPI(params) {
  return request({
    url:'api/sendAdminCode',
    method:'POST',
    data: params
  })
}

export function getUserListAPI(params) {
  return request({
    url:'admin/getUserList',
    method:'POST',
    data: params
  })
}

export function delUserAPI(params) {
  return request({
    url:'admin/delUser',
    method:'POST',
    data: params
  })
}

export function editUserAPI(params) {
  return request({
    url:'admin/editUser',
    method:'POST',
    data: params
  })
}