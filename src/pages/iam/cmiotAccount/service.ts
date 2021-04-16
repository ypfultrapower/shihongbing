import { TableListParams } from '@/common/data/commondata';
import http from '@/utils/http';

export async function queryCmiotAccount(params?: TableListParams) {
  return http.json('/api/iam/cmiotacc/page', params);
}
