import { CurrentOrgActionTypes, CurruntOrgState, SET_CURRENT_ORG } from '../../types/currentOrgTypes';
import { ExampleActionTypes, ExampleState, SET_EXAMPLE } from '../../types/exampleTypes';

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

export function setCurOrg(org: number) {
  return {
    type: SET_CURRENT_ORG,
    payload: org,
  };
}
