import { request } from "@/utils/request";

export function getGoodsByIdAPI(params) {
  return request({
    url:'getGoods/getGoodsById',
    method:'POST',
    data: params
  })
}

export async function getGoodsListAPI(params) {
  return request({
    url:'getGoods/getGoodsList',
    method:'POST',
    data: params
  })
}

export function addGoodsAPI(params) {
  return request({
    url:'manageGoods/addGoods',
    method:'POST',
    data: params
  })
}

export function updateGoodsAPI(params) {
  return request({
    url:'manageGoods/updateGoods',
    method:'POST',
    data: params
  })
}

export function delGoodsAPI(params) {
  return request({
    url:'manageGoods/delGoods',
    method:'POST',
    data: params
  })
}