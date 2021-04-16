import request from "umi-request";
import {AgentTableListItem} from "@/pages/agent/data";
import http from "@/utils/http";
import {TableListParams} from "@/common/data/commondata";

/**
 * agent批量删除
 * @param params
 */
export async function batchDeleteAgent(params: any) {
  return request('/api/agent/batchDelete', {
    method: 'POST',
    data: params
  });
}

/**
 * agent批量审批通过入网
 * @param params
 */
export async function batchAgreeAccess(params: AgentTableListItem[]) {
  const postData = params.map((item,index,array)=>{
    return  {"id":item.id}
  });
  return request('/api/agent/batchAgreeAccess', {
    method: 'POST',
    data: postData
  });
}

/**
 * agent批量拒绝入网
 * @param params
 */
export async function batchDisAgreeAccess(params: AgentTableListItem[]) {
  const postData = params.map((item,index,array)=>{
    return  {"id":item.id}
  });
  return request('/api/agent/batchDisAgreeAccess', {
    method: 'POST',
    data: postData
  });
}

export async function queryAgent(params?: TableListParams) {
  return http.json('/api/agent/page', params);
}

export async function queryAssetGroup(params?: TableListParams) {
  return http.json('/api/assetGroup/page', params);
}

export async function queryAccessedAgent(params?: any) {
  params.networkStatus = "accessed";
  return http.json('/api/agent/page', params);
}


export async function addAgent(params:{}) {
  return http.json('/api/agent/add',params);
}

export async function modifyAgent(params:{}) {
  return http.json('/api/agent/modify',params);
}

