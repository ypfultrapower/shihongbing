import {MenuItem } from './data';
import { Effect, Reducer } from 'umi';
import { getMenuTree } from './service';
import { TableListData } from '@/common/data/commondata';

export interface StateType{
  tableListData?: TableListData;
  treeData?: MenuItem[];
}

export interface ModelType{
  namespace: string;
  state: StateType;
  effects: {
    fetchTree: Effect;
  };
  reducers: {
    treeQuery: Reducer<StateType>;
  };
}
const Model: ModelType = {
  namespace: 'authorizationMenu',
  state:{
    tableListData:{pagination:{defaultCurrent:1,defaultPageSize:10},data:[]},
    treeData:[]
  },
  effects: {
    *fetchTree({ payload },{ call, put }) {
      const response = yield call(getMenuTree,payload);
      yield put({
        type: 'treeQuery',
        payload: response.data,
      });
    }
  },

  reducers: {
    treeQuery(state, action) {
      return {
        ...state,
        treeData:action.payload,
      };
    }
  },
}
export default Model;

