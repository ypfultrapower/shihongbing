import {RoleItem } from './data';
import { Effect, Reducer } from 'umi';
import { addRole, authorize, getAuthorityUsers, getRoleTree, modifyRole } from './service';
import { TableListData, TableListPagination } from '@/common/data/commondata';
import { MenuItem } from '@/pages/authorization/menu/data';
import { getMenuTree } from '@/pages/authorization/menu/service';

export interface StateType{
  treeData?: RoleItem[];
  authorityUsers?: TableListData;
  allMenus?: MenuItem[];
}

export interface ModelType{
  namespace: string;
  state: StateType;
  effects: {
    fetchRoleTree: Effect;
    fetchAuthorityUsers: Effect;
    fetchAllMenus: Effect;
    authorize:Effect;
    submit: Effect;
  };
  reducers: {
    treeQuery: Reducer<StateType>;
    authorityUserQuery: Reducer<StateType>;
    allMenuQuery:Reducer<StateType>;
  };
}
const Model: ModelType = {
  namespace: 'authorizationRole',
  state:{
    treeData:[],
    allMenus:[],
    authorityUsers:{pagination:{defaultCurrent:1,defaultPageSize:10},data:[]}
  },
  effects: {
    *fetchRoleTree({ payload },{ call, put }) {
      const response = yield call(getRoleTree,payload);
      yield put({
        type: 'treeQuery',
        payload: response.data,
      });
    },
    *fetchAuthorityUsers({ payload },{ call, put }) {
      const response = yield call(getAuthorityUsers,payload);
      yield put({
        type: 'authorityUserQuery',
        payload: response,
      });
    },
    *fetchAllMenus({ payload},{ call, put }) {
      const response = yield call(getMenuTree,payload);
      yield put({
        type: 'allMenuQuery',
        payload: response.data,
      });
    },
    *submit({ payload,callback }, { call, put }) {
      let callMethod;
      if (payload.optType==="add") {
        callMethod = addRole;
      } else {
        callMethod = modifyRole;
      }
      const response = yield call(callMethod, payload); // post
      callback(response);
    },
    *authorize({ payload,callback }, { call, put }) {
      const response = yield call(authorize, payload); // post
      callback(response);
    }
  },
  reducers: {
    treeQuery(state, action) {
      return {
        ...state,
        treeData:action.payload,
      };
    },
    authorityUserQuery(state, action) {
      const pageInfo = action.payload;
      const pagination:Partial<TableListPagination> = { total:pageInfo.total, pageSize:pageInfo.pageSize, current:pageInfo.current+1};
      return {
        ...state,
        authorityUsers:{pagination:pagination,data:pageInfo.data},
      };
    },
    allMenuQuery(state, action) {
      return {
        ...state,
        allMenus:action.payload,
      };
    },
  },
}
export default Model;
