//查询
import {TableListParams} from "@/common/data/commondata";
import http from "@/utils/http";
import request from "umi-request";

export async function queryWhiteSourceIp(params?: TableListParams) {
  return http.json('/api/whiteSourceIp/page', params);
}
//新增
export async function addWhiteSourceIp(params:{}) {
  return http.json('/api/whiteSourceIp/add',params);
}
//修改
export async function modifyWhiteSourceIp(params:{}) {
  return http.json('/api/whiteSourceIp/modify',params);
}
//批量删除
export async function batchDeleteWhiteSourceIp(params: any) {
  return request('/api/whiteSourceIp/delete', {
    method: 'POST',
    data: params
  });
}
