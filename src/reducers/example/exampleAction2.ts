import { Dispatch } from 'redux';
import { FETCH_DATA_REQUEST, FETCH_DATA_SUCCESS, FETCH_DATA_FAILURE } from '../../types/exampleTypes2';
import axios from 'axios';
import { telegramBotUrl } from '../../constant/constant';

interface Data {
  // определите типы данных, которые вы ожидаете получить с сервера
}

export const fetchData = () => {
  return (dispatch: Dispatch) => {
    dispatch({ type: FETCH_DATA_REQUEST });
    axios.get(telegramBotUrl + '/getUserMenu/')
      .then(response => {
        const data: Data = response.data;
        dispatch({ type: FETCH_DATA_SUCCESS, payload: data });
      })
      .catch(error => {
        dispatch({ type: FETCH_DATA_FAILURE, payload: error.message });
      });
  };
};