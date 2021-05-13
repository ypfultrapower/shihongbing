import {TableListParams} from "@/common/data/commondata";
import http from "@/utils/http";
import request from "umi-request";

//分页查询
export async function pageQuery(params?: TableListParams) {
  return http.json('/api/user/page', params);
}
//添加
export async function addUser(params:{}) {
  return http.json('/api/user/add',params);
}
//修改
export async function modifyUser(params:{}) {
  return http.json('/api/user/modify',params);
}
//删除
export async function batchDeleteUser(params: any) {
  return request('/api/user/batchDelete', {
    method: 'POST',
    data: params
  });
}
//修改密码
export async function modifyPwd(params: any) {
  return request('/api/user/modifyPwd', {
    method: 'POST',
    data: params
  });
}
//角色授权
export async function authorize(params: any) {
  return request('/api/user/authorize', {
    method: 'POST',
    data: params
  });
}
