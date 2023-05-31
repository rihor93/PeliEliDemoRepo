import { Dispatch } from 'redux';
import { FETCH_DATA_REQUEST, FETCH_DATA_SUCCESS, FETCH_DATA_FAILURE, MenuServerDataType } from '../menuData/menuDataLoadTypes';
import axios from 'axios';
import { telegramBotUrl } from '../../constant/constant';


export const loadMenuServerData = () => {
    //const currentOrg = useSelector((state: RootState) => state.userOrg.curOrg);
    console.log('loadMenuServerData')
    return (dispatch: Dispatch) => {
        dispatch({ type: FETCH_DATA_REQUEST, });
        axios.get(telegramBotUrl + '/getUserMenu/')
            .then(response => {
                const data: MenuServerDataType = response.data;
                dispatch({
                    type: FETCH_DATA_SUCCESS,
                    payload: {loading: false, error: 'menuData', data: data},
                })
                //console.log(response.data);
                console.log('loadMenuServerData', response.data)
            })
            .catch(error => {
                dispatch({ type: FETCH_DATA_FAILURE, payload: {loading: false, error: error.message} });
            });
    };
};