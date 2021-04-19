//查询
import {TableListParams} from "@/common/data/commondata";
import http from "@/utils/http";
import request from "umi-request";

export async function queryWhiteDestIp(params?: TableListParams) {
  return http.json('/api/whiteDestIp/page', params);
}
//新增
export async function addWhiteDestIp(params:{}) {
  return http.json('/api/whiteDestIp/add',params);
}
//修改
export async function modifyWhiteDestIp(params:{}) {
  return http.json('/api/whiteDestIp/modify',params);
}
//批量删除
export async function batchDeleteWhiteDestIp(params: any) {
  return request('/api/whiteDestIp/delete', {
    method: 'POST',
    data: params
  });
}
