import {TableListParams} from "@/common/data/commondata";
import http from "@/utils/http";
import request from "umi-request";

export async function queryApiWarning(params?: TableListParams) {
  return http.json('/api/apiAnalysisWarning/page', params);
}

export async function batchHandleApiWarning(params: any) {
  return request('/api/apiAnalysisWarning/handle', {
    method: 'POST',
    data: params
  });
}
