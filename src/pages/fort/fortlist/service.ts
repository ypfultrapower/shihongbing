import {TableListParams} from "@/common/data/commondata";
import http from "@/utils/http";
import request from "umi-request";

//查询
export async function queryFort(params?: TableListParams) {
  return http.json('/api/fort/page', params);
}
//新增
export async function addFort(params:{}) {
  return http.json('/api/fort/add',params);
}
//修改
export async function modifyFort(params:{}) {
  return http.json('/api/fort/modify',params);
}
//批量删除
export async function batchDeleteFort(params: any) {
  return request('/api/fort/batchDelete', {
    method: 'POST',
    data: params
  });
}
