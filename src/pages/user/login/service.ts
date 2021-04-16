import request from '@/utils/request';
import http from '@/utils/http';

export interface LoginParamsType {
  username: string;
  password: string;
  mobile: string;
  captcha: string;
  grant_type: string;
}

export async function passwordLogin(params: LoginParamsType) {
  return http.json('/api/auth/password',params);
}

export async function passwordAndCaptchLogin(params: LoginParamsType) {
  return http.json('/api/auth/captcha',params);
}

export async function smsLogin(params: LoginParamsType) {
  return http.json('/api/auth/sms',params);
}

//http://192.168.1.48/foo/api
export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
