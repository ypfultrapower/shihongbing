import http from '@/utils/http';
import { TableListParams } from '@/common/data/commondata';
import request from 'umi-request';
/**
 * 任务列表
 * @param params
 */
export async function queryJobs(group:string,params?: TableListParams) {
  let queryData ={"group":group,...params};
  return http.json('/api/task/page',queryData);
}

/**
 * 新增任务
 * @param params
 */
export async function addJob(params: any) {
  return request('/api/task/add', {
    method: 'POST',
    data: params,
  });
}
export async function runRightNow(params: any) {
  return request('/api/task/runTaskNow', {
    method: 'POST',
    data: params,
  });
}

export async function deleteJob(params: any) {
  return request('/api/task/delete', {
    method: 'POST',
    data: params
  });
}
