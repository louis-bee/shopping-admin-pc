import { request } from "@/utils/request";

export function getMonthLoginByAdminAPI(params) {
  return request({
    url:'data/getMonthLoginByAdmin',
    method:'POST',
    data: params
  })
}

export function getTopSellerAPI(params) {
  return request({
    url:'data/getTopSeller',
    method:'POST',
    data: params
  })
}