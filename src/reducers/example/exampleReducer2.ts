import { FETCH_DATA_REQUEST, FETCH_DATA_SUCCESS, FETCH_DATA_FAILURE } from '../../types/exampleTypes2';

interface ExampleState {
  loading: boolean;
  data: any;
  error: string;
}

const initialState: ExampleState = {
  loading: false,
  data: null,
  error: '',
};

export const exampleReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case FETCH_DATA_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_DATA_SUCCESS:
      return {
        loading: false,
        data: action.payload,
        error: '',
      };
    case FETCH_DATA_FAILURE:
      return {
        loading: false,
        data: null,
        error: action.payload,
      };
    default:
      return state;
  }
};
