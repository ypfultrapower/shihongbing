import http from "@/utils/http";

export async function addBlockStrategy(params: any) {
  return http.json('/api/blockStrategy/add',params);
}

export async function modifyBlockStrategy(params: any) {
  return http.json('/api/blockStrategy/modify',params);
}
