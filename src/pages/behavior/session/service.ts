import {TableListParams} from "@/common/data/commondata";
import http from "@/utils/http";
import request from "umi-request";

//会话查询
export async function querySession(params?: TableListParams) {
  return http.json('/api/session/page', params);
}
//获取会话内容
export async function getRecordContent(params?: any) {
  return http.json('/api/session/readRecord',params);
}
//阻断会话
export async function blockSession(sessionId: string ) {
  return http.get('/api/session/block/'+sessionId);
}

//已阻断会话查询
export async function queryBlockedSession(params?: any) {
  return http.json('/api/blockEvent/page', params);
}

export async function batchDeleteSession(params: any) {
  return request('/api/session/delete', {
    method: 'POST',
    data: params
  });
}

