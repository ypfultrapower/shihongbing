import { Effect } from 'umi';
import {modifyAgentAnalysis, modifyApiAnalysis} from "@/pages/handle/analysisStrategy/service";
export interface ModelType {
  namespace: string;
  state: {};
  effects: {
    submitForm: Effect;
  };
}
const Model: ModelType = {
  namespace: 'analysisStrategy',

  state: {},

  effects: {
    *submitForm({ payload,callback }, { call, put }) {
      let callMethod;
      if (payload.optType==="agentAnalysis") {
        callMethod = modifyAgentAnalysis;
      } else {
        callMethod = modifyApiAnalysis;
      }
      const response = yield call(callMethod, payload); // post
      callback(response);
    },
  },
};

export default Model;
