import { FETCH_DATA_FAILURE, FETCH_DATA_REQUEST, FETCH_DATA_SUCCESS, MenuDataLoadActionTypes, MenuDataLoadState, MenuServerDataType } from '../../types/menuDataLoadTypes';
import { MenuState, MenuStateActionTypes, MenuStateState, SET_MENU_STATE } from '../../types/menuStateTypes';

const initialState: MenuDataLoadState = {
  loading: false,
  data: null,
  error: '',
};

export const courseMenuDataLoadReducer = (state = initialState, action: MenuDataLoadActionTypes) : MenuDataLoadState => {
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
        error: typeof action.payload == 'string' ? action.payload : '',
      };
    default:
      return state;
  }
};


export function setCourseMenuLoading() {
  return {
    type: FETCH_DATA_REQUEST,
    payload: null,
  };
}

export function setCourseMenuLoad(data: MenuServerDataType) {
  return {
    type: FETCH_DATA_SUCCESS,
    payload: data,
  };
}

export function setCourseMenuError(error: string) {
  return {
    type: FETCH_DATA_FAILURE,
    payload: error,
  };
}