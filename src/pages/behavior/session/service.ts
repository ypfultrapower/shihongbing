import {TableListParams} from "@/common/data/commondata";
import http from "@/utils/http";

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
