import { FETCH_DATA_FAILURE, FETCH_DATA_REQUEST, FETCH_DATA_SUCCESS, UserInfoActionTypes, UserInfoLoadState, UserInfoState } from "./userInfoTypes";


const initialState: UserInfoLoadState = {loading: true, data: { userName: '', userBonuses: 0, percentDiscounts: [], dishDiscounts: [], allCampaign: [], dishSet: [] }, error: ''};

export const userInfoReducer = (state = initialState, action: UserInfoActionTypes) : UserInfoLoadState => {
  switch (action.type) {
    case FETCH_DATA_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_DATA_SUCCESS:
      return {
        loading: false,
        data: action.payload.data,
        error: '',
      };
    case FETCH_DATA_FAILURE:
      return {
        loading: false,
        data: { userName: '', userBonuses: 0, percentDiscounts: [], dishDiscounts: [], allCampaign: [], dishSet: [] },
        error: action.payload.error,
      };
    default:
      return state;
  }
};


/*export function setCourseMenuLoading() {
  return {
    type: FETCH_DATA_REQUEST,
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
}*/