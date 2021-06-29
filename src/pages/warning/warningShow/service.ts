import {TableListParams} from "@/common/data/commondata";
import http from "@/utils/http";
import request from "umi-request";

export async function queryWarning(params?: TableListParams) {
  return http.json('/api/warning/page', params);
}

export async function batchDeleteBlockWarning(params: any) {
  return request('/api/warning/delete', {
    method: 'POST',
    data: params
  });
}

export async function batchHandleWarning(params: any) {
  return request('/api/warning/handle', {
    method: 'POST',
    data: params
  });
}
