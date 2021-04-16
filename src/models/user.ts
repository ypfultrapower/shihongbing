import { Effect, Reducer } from 'umi';

import { queryCurrent, query as queryUsers, queryMenus } from '@/services/user';
import { MenuDataItem } from '@ant-design/pro-layout';
import {setAuthority as setProAuthority} from '@/utils/authority';

export function setAuthority(authority: string | string[]) {
  // const proAuthority = typeof authority === 'string' ? [authority] : authority;
  // localStorage.setItem('authority', JSON.stringify(proAuthority));
  // hard code
  // reload Authorized component
  setProAuthority(authority);
  try {
    if ((window as any).reloadAuthorized) {
      (window as any).reloadAuthorized();
    }
  } catch (error) {
    // do not need do anything
  }
  return authority;
}

export interface CurrentUser {
  avatar?: string;
  username?: string;
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  account?: string;
  unreadCount?: number;
  roles?:string[];
}

export interface UserModelState {
  currentUser?: CurrentUser;
  currentUserMenus?:MenuDataItem[];
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
    fetchMenus:Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
    saveMenu:Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
    currentUserMenus:[]
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    // 获取当前用户菜单权限
    *fetchMenus(_, { call, put }) {
      const response = yield call(queryMenus);
      if(response){
        yield put({
          type: 'saveMenu',
          payload: response.data,
        });
      }
    }
  },

  reducers: {
    saveCurrentUser(state, action) {
      let authorities =  action.payload.data.authorities;
      let roles:string[] = new Array()
      for(let i=0;i<authorities.length;i++){
        let role = authorities[i]
        roles.push(role.authority);
      }
      setAuthority(roles);
      return {
        ...state,
        currentUser: action.payload.data || {},
      };
    },
    saveMenu(state,action){
      return{
        ...state,
        currentUserMenus:action.payload || [],
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    }
  },
};

export default UserModel;
