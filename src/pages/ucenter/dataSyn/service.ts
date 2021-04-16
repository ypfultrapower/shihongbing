import request from 'umi-request';
import { TableListParams } from './data.d';
import http from '@/utils/http';

/**
 * 用户中心账号查询
 * @param params
 */
export async function queryUCUser(params?: TableListParams) {
  return http.json('/api/ucuser/page', params);
}

export async function queryRule(params?: TableListParams) {
  return request('/api/rule', {
    params,
  });
}

export async function removeRule(params: { key: any }) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}

/**
 * 处理结果下载
 * @param params
 */
export async function downloadResult(params = {}) {
  return request(`/api/ucuser/downLoadFile`, {
    method: 'POST', // GET / POST 均可以
    responseType : 'blob', // 必须注明返回二进制流
    data:params
  });
}
