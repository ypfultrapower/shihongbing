//查询
import {TableListParams} from "@/common/data/commondata";
import http from "@/utils/http";
import request from "umi-request";
import {StrategyTableListItem} from "@/pages/handle/blockStrategy/data";

export async function queryStrategy(params?: TableListParams) {
  return http.json('/api/blockStrategy/page', params);
}

export async function batchEnableStrategy(params: StrategyTableListItem[]) {
  const postData = params.map((item,index,array)=>{
    return  {"id":item.id}
  });
  return request('/api/blockStrategy/enable', {
    method: 'POST',
    data: postData
  });
}

export async function batchDisableStrategy(params: StrategyTableListItem[]) {
  const postData = params.map((item,index,array)=>{
    return  {"id":item.id}
  });
  return request('/api/blockStrategy/disable', {
    method: 'POST',
    data: postData
  });
}

export async function batchDeleteStrategy(params: any) {
  return request('/api/blockStrategy/delete', {
    method: 'POST',
    data: params
  });
}
