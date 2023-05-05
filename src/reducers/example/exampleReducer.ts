import { ExampleActionTypes, ExampleState, SET_EXAMPLE } from '../../types/exampleTypes';

const initialState: ExampleState = {
  example: '',
};

export function exampleReducer(state = initialState, action: ExampleActionTypes): ExampleState {
  switch (action.type) {
    case SET_EXAMPLE:
      return {
        ...state,
        example: action.payload,
      };
    default:
      return state;
  }
}

export function setExample(example: string) {
  return {
    type: SET_EXAMPLE,
    payload: example,
  };
}
