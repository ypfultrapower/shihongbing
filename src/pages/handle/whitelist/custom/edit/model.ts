import { Effect } from 'umi';
import {addCustomWhiteList, modifyCustomWhiteList} from "@/pages/handle/whitelist/custom/service";

export interface ModelType {
  namespace: string;
  state: {};
  effects: {
    submitForm: Effect;
  };
}
const Model: ModelType = {
  namespace: 'customWhiteList',

  state: {},

  effects: {
    *submitForm({ payload,callback }, { call, put }) {
      let callMethod;
      if (payload.optType==="add") {
        callMethod = addCustomWhiteList;
      } else {
        callMethod = modifyCustomWhiteList;
      }
      const response = yield call(callMethod, payload); // post
      callback(response);
    },
  },
};

export default Model;
