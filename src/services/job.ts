import http from '@/utils/http';
import { TableListParams } from '@/common/data/commondata';
import request from 'umi-request';
import moment from 'moment';
/**
 * 任务列表
 * @param params
 */
export async function queryJobs(params?: TableListParams) {
  let queryData ={"jobGroup":"ucenter-smapSyn",...params};
  return http.json('/api/job/page',queryData);
}

/**
 * 新增任务
 * @param params
 */
export async function addJob(params: any) {
  //时间格式转换
  params.nextFireTime = moment(params.nextFireTime).format('YYYY-MM-DD HH:mm:ss')
  return request('/api/job/add', {
    method: 'POST',
    data: params,
  });
}

export async function deleteJob(params: any) {
  return request('/api/job/delete', {
    method: 'POST',
    data: params
  });
}

// export async function addJob(params: TableListItem) {
//   return request('/api/rule', {
//     method: 'POST',
//     data: {
//       ...params,
//       method: 'post',
//     },
//   });
// }



// export async function updateRule(params: FormValueType) {
//   return request('/api/rule', {
//     method: 'POST',
//     data: {
//       ...params,
//       method: 'update',
//     },
//   });
// }


export async function queryRule(params?: TableListParams) {
  return request('/api/rule', {
    params,
  });
}
