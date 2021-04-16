import http from '@/utils/http';
import { TableListParams } from '@/common/data/commondata';
import request from 'umi-request';
export async function getMenuByPid(pid:string,params?: TableListParams) {
  let queryData ={"pid":pid,...params};
  return http.json('/api/menu/getWithParentId',queryData);
}

export async function getMenuTree() {
  return http.get('/api/menu/tree');
}

export async function addMenu(params:{}) {
  return http.json('/api/menu/add',params);
}

export async function modifyMenu(params:{}) {
  return http.json('/api/menu/modify',params);
}


export async function deleteMenu(params: any) {
  return request('/api/menu/delete', {
    method: 'POST',
    data: params
  });
}
