//查询
import {TableListParams} from "@/common/data/commondata";
import http from "@/utils/http";
import request from "umi-request";

export async function queryCustomWhiteList(params?: TableListParams) {
  return http.json('/api/customWhiteList/page', params);
}
//新增
export async function addCustomWhiteList(params:{}) {
  return http.json('/api/customWhiteList/add',params);
}
//修改
export async function modifyCustomWhiteList(params:{}) {
  return http.json('/api/customWhiteList/modify',params);
}
//批量删除
export async function batchDeleteCustomWhiteList(params: any) {
  return request('/api/customWhiteList/delete', {
    method: 'POST',
    data: params
  });
}
