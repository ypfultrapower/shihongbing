import {TableListParams} from "@/common/data/commondata";
import http from "@/utils/http";

export async function querySchedule(params?: TableListParams) {
  return http.json('/api/schedule/page', params);
}
