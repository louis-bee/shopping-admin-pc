import { request } from "@/utils/request";

export function getLoginLogListAPI(params) {
  return request({
    url:'log/getLoginLogList',
    method:'POST',
    data: params
  })
}

export function delLoginLogAPI(params) {
  return request({
    url:'log/delLoginLog',
    method:'POST',
    data: params
  })
}