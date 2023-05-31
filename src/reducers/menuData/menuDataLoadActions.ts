import { Dispatch } from 'redux';
import { FETCH_DATA_REQUEST, FETCH_DATA_SUCCESS, FETCH_DATA_FAILURE, MenuServerDataType } from './menuDataLoadTypes';
import axios from 'axios';
import { telegramBotUrl } from '../../constant/constant';

interface Data {
  // определите типы данных, которые вы ожидаете получить с сервера
}

export const loadMenuServerData = () => {
  return (dispatch: Dispatch) => {
    dispatch({type: FETCH_DATA_REQUEST,});
    axios.get(telegramBotUrl + '/getUserMenu/')
      .then(response => {
        const data: MenuServerDataType = response.data;
        dispatch({
            type: FETCH_DATA_SUCCESS,
            payload: data,
          })
        console.log(response.data);
      })
      .catch(error => {
        dispatch({ type: FETCH_DATA_FAILURE, payload: error.message });
      });
  };
};