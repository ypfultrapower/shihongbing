import request from 'umi-request';
import http from '@/utils/http';
export async function query(): Promise<any> {
  return request('/api/users');
}

/**
 * 查询当前登录用户
 */
export async function queryCurrent(): Promise<any> {
  return request('/api/current');
}

/**
 * 查询消息
 */
export async function queryNotices(): Promise<any> {
  return request('/api/notices/getNotices');
}

/**
 * 查询当前用户菜单权限
 */
export async function queryMenus():Promise<any> {
  return http.get('/api/menu/getRunTimeUserMenus');
  //return http.get('/api/menu/tree');
}
