import request from "umi-request";
import {AgentAnalysisStrategy, ApiAnalysisStrategy} from "@/pages/handle/analysisStrategy/data";
import {TableListParams} from "@/common/data/commondata";
import http from "@/utils/http";

//agent端分析策略启用
export async function batchEnableAgentAnalysisStrategy(params: AgentAnalysisStrategy[]) {
  const postData = params.map((item,index,array)=>{
    return  {"id":item.id}
  });
  return request('/api/agentAnalysisStrategy/enable', {
    method: 'POST',
    data: postData
  });
}

//agent端分析策略禁用
export async function batchDisableAgentAnalysisStrategy(params: AgentAnalysisStrategy[]) {
  const postData = params.map((item,index,array)=>{
    return  {"id":item.id}
  });
  return request('/api/agentAnalysisStrategy/disable', {
    method: 'POST',
    data: postData
  });
}

//api端分析策略启用
export async function batchEnableApiAnalysisStrategy(params: ApiAnalysisStrategy[]) {
  const postData = params.map((item,index,array)=>{
    return  {"id":item.id}
  });
  return request('/api/apiAnalysisStrategy/enable', {
    method: 'POST',
    data: postData
  });
}
//api端分析策略禁用
export async function batchDisableApiAnalysisStrategy(params: ApiAnalysisStrategy[]) {
  const postData = params.map((item,index,array)=>{
    return  {"id":item.id}
  });
  return request('/api/apiAnalysisStrategy/disable', {
    method: 'POST',
    data: postData
  });
}

//分页查询agent端分析策略
export async function queryAgentAnalysisStrategy(params?: TableListParams) {
  return http.json('/api/agentAnalysisStrategy/page', params);
}

//分页查询api端分析策略
export async function queryApiAnalysisStrategy(params?: TableListParams) {
  return http.json('/api/apiAnalysisStrategy/page', params);
}

//agent端分析策略修改
export async function modifyAgentAnalysis(params: any) {
  return http.json('/api/agentAnalysisStrategy/modify',params);
}

//api端分析策略修改
export async function modifyApiAnalysis(params: any) {
  return http.json('/api/apiAnalysisStrategy/modify',params);
}
