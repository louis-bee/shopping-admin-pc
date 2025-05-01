import { request } from "@/utils";

export function getOrderListAPI(params) {
  return request({
    url:'order/getOrderListBySeller',
    method:'POST',
    data: params
  })
}

export function deliveryAPI(params) {
  return request({
    url:'order/delivery',
    method:'POST',
    data: params
  })
}