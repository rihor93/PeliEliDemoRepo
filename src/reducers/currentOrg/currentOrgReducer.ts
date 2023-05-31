import { CurrentOrgActionTypes, CurruntOrgState, SET_CURRENT_ORG } from './currentOrgTypes';

const initialState: CurruntOrgState = {
  curOrg: 0,
};

export function currentOrgReducer(state = initialState, action: CurrentOrgActionTypes): CurruntOrgState {
  switch (action.type) {
    case SET_CURRENT_ORG:
      console.log({action: action.payload, state: state.curOrg});
      if (state.curOrg != action.payload) {
        //console.log('123')
        return {
          ...state,
          curOrg: action.payload,
        };
      } else {
        //console.log('456')
        return state;
      }
    default:
      return state;
  }
}

