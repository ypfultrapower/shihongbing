//查询
import {TableListParams} from "@/common/data/commondata";
import http from "@/utils/http";
import request from "umi-request";

export async function queryWhiteUser(params?: TableListParams) {
  return http.json('/api/whiteUser/page', params);
}
//新增
export async function addWhiteUser(params:{}) {
  return http.json('/api/whiteUser/add',params);
}
//修改
export async function modifyWhiteUser(params:{}) {
  return http.json('/api/whiteUser/modify',params);
}
//批量删除
export async function batchDeleteWhiteUser(params: any) {
  return request('/api/whiteUser/delete', {
    method: 'POST',
    data: params
  });
}
