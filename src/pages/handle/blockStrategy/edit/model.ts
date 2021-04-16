import { Effect } from 'umi';
import {addBlockStrategy, modifyBlockStrategy} from "@/pages/handle/blockStrategy/edit/service";

export interface ModelType {
  namespace: string;
  state: {};
  effects: {
    submitForm: Effect;
  };
}
const Model: ModelType = {
  namespace: 'blockStrategy',

  state: {},

  effects: {
    *submitForm({ payload,callback }, { call, put }) {
      let callMethod;
      if (payload.optType==="add") {
        callMethod = addBlockStrategy;
      } else {
        callMethod = modifyBlockStrategy;
      }
      const response = yield call(callMethod, payload); // post
      callback(response);
    },
  },
};

export default Model;
