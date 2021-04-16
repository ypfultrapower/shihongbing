// get 请求，参数拼接在 url 后面。并且需要在 headers 里面添加参数 token
import request from '@/utils/request';
import qs from 'qs';

const requestGet = (url: string, data?: object) => {
  url = `${url}?${qs.stringify({ ...data, t: Date.now() })}`;
  return request.get(url,{headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }});
}


// post 请求，form 格式
const requestPost = (url: string, data?: object) => {
  return request.post(url, {
    method: 'POST',
    data: {
      ...data
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// post 请求，要求的入参却是 json 格式
const requestPostJson = (url: string, data?: object) => {
  return request.post(url, {
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
  })
}
// 这是全局的拦截，还可以写局部的拦截器
export default {
  get: requestGet,
  post: requestPost,
  json: requestPostJson
};
