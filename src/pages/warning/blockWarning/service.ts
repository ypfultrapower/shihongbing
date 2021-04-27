import {TableListParams} from "@/common/data/commondata";
import http from "@/utils/http";
import request from "umi-request";

export async function queryBlockWarning(params?: TableListParams) {
  return http.json('/api/blockWarning/page', params);
}

export async function batchDeleteBlockWarning(params: any) {
  return request('/api/blockWarning/delete', {
    method: 'POST',
    data: params
  });
}
