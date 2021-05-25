import {TableListParams} from "@/common/data/commondata";
import http from "@/utils/http";

//会话查询
export async function queryESSession(params?: TableListParams) {
  return http.json('/api/document/usersession/pageQuery', params);
}



