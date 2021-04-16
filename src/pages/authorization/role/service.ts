import http from '@/utils/http';
import { TableListParams } from '@/common/data/commondata';
import request from 'umi-request';

export async function getRoleTree() {
  return http.json('/api/role/query',{});
}

export async function getAuthorityUsers(params?: TableListParams) {
  return http.json('/api/role/getAuthorityUsers',params);
}

export async function addRole(params:{}) {
  return http.json('/api/role/add',params);
}

export async function modifyRole(params:{}) {
  return http.json('/api/role/modify',params);
}

export async function authorize(params:{}) {
  return http.json('/api/role/authorize',params);
}

export async function deleteRole(params: any) {
  return request('/api/role/delete', {
    method: 'POST',
    data: params
  });
}

