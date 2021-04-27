import {TableListParams} from "@/common/data/commondata";
import http from "@/utils/http";
import request from "umi-request";

//会话查询
export async function querySession(params?: TableListParams) {
  return http.json('/api/session/page', params);
}
//获取会话内容
export async function getRecordContent(sessionId: string | undefined) {
  return http.get('/api/session/record/'+sessionId);
}
//阻断会话
export async function blockSession(sessionId: string ) {
  return http.get('/api/session/block/'+sessionId);
}

//已阻断会话查询
export async function queryBlockedSession(params?: any) {
  let closeTypeArray: string[] = new Array();
  closeTypeArray.push("userBlock");
  closeTypeArray.push("agentBlock");
  params.closeType = closeTypeArray;
  return http.json('/api/session/page', params);
}

export async function batchDeleteSession(params: any) {
  return request('/api/session/delete', {
    method: 'POST',
    data: params
  });
}

