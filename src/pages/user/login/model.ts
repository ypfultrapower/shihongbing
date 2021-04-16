import { Effect, history, Reducer } from 'umi';
import { message, notification } from 'antd';
import { parse } from 'qs';
import { passwordAndCaptchLogin,smsLogin,getFakeCaptcha } from './service';
export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}


export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    getCaptcha: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'userAndlogin',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      let loginMethod;
      if(payload.type==="password"){
        loginMethod = passwordAndCaptchLogin;
      }else if(payload.type==="sms"){
        loginMethod = smsLogin;
      }
      const response = yield call(loginMethod, payload);
      //登录成功
      if (response && response.data) {
        message.success('登录成功！');
        //登录成功后改变登录状态
        yield put({
          type: 'changeLoginStatus',
          payload: {...response,status:'ok',...payload.type},
        });
        history.replace('/');
      }
      //登录失败
      else{
        yield put({
          type: 'changeLoginStatus',
          payload: {status:'error',...payload.type},
        });
        notification.error({
          description: response.message,
          message: '登录失败',
          placement:'bottomRight'
        });
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },
  },

  //改变登录状态
  reducers: {
    changeLoginStatus(state, { payload }) {
      localStorage.setItem("access_token",payload.data.access_token);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

export default Model;
