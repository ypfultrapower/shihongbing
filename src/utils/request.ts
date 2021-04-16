import { extend } from 'umi-request';
import { notification } from 'antd';
import { history } from 'umi';
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
/**
 * 异常处理程序
 * 请求已发送但服务端返回状态码非 2xx 的响应
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  }else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};

const request = extend({
  //prefix: BASE_URL,//配置真实后台服务地址，不配置则使用的是本地mock地址
  timeout: 30000,
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

// 这是全局的拦截，还可以写局部的拦截器
// request拦截器, 改变url 或 options.
request.interceptors.request.use((url, options)  => {
  //除了认证获取token请求都需要带上Authorization请求头
  if(url.indexOf("/auth/password")===-1 && url.indexOf("/auth/sms")===-1 && url.indexOf("/auth/captcha")===-1){
    options.headers = {
      'Authorization': "Bearer "+ localStorage.getItem("access_token"),
      ...options.headers
    }
  }else {
    options.headers = {
      ...options.headers
    };
  }
  return (
    {
      url: url,
      options: options,
    }
  );
});
// response拦截器, 处理response
request.interceptors.response.use(async response => {
  if(response.headers.get("Content-Type") =='application/octet-stream'){
    return response.blob();
  }
  const data = await response.clone().json();
  //远程跨域请求,远程服务restful api接口返回统一的success参数,表示请求成功还是失败
  if(response.status == 200 ){
    if(data.code === 401){
      invalidToken(data);
      return
    }
    return data;
  }
  //401 跳转到登录页面
  else if(response.status == 401){
    notification.error({
      description: data.message || codeMessage[401],
      message: data.message
    });
    localStorage.removeItem("access_token");
    history.push('/user/login');
  }
  //403跳转到403页面
  else if(response.status ==403){
    history.push('/exception/403');
  }
  else if(response.status ==404){
    history.push('/exception/404');
  }
  //500错误
  else if(response.status ==500){
    history.push({
      pathname:'/exception/500',
      query:{err:data.message}
    });
  }else if(response.url.indexOf("/auth")!=-1){
    return data;
  }
  //其他错误给出提示
  else{
    invalidToken(data)
  }
  return data;
});

function invalidToken(data:any){
  notification.error({
    description: data.message || '您的网络发生异常，无法连接服务器',
    message: data.message
  });
  localStorage.removeItem("access_token");
  history.push('/user/login');
}

export default request;
