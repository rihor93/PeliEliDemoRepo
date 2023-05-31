import { Dispatch } from 'redux';
import axios from 'axios';
import { telegramBotUrl } from '../../constant/constant';
import { FETCH_DATA_REQUEST, FETCH_DATA_SUCCESS, FETCH_DATA_FAILURE, OrgDatas } from '../organization/organizationTypes';


export const orgServerData = () => {
    //const currentOrg = useSelector((state: RootState) => state.userOrg.curOrg);
    //console.log('orgServerData')
    return (dispatch: Dispatch) => {
        dispatch({ type: FETCH_DATA_REQUEST, });
        axios.get(telegramBotUrl + '/GetOrgForWeb/')
            .then(response => {
                const data: OrgDatas = response.data;
                dispatch({
                    type: FETCH_DATA_SUCCESS,
                    payload: {loading: false, error: 'orgData', data: data},
                })
                //console.log(response.data);
                //console.log('orgServerData', response.data)
            })
            .catch(error => {
                dispatch({ type: FETCH_DATA_FAILURE, payload: {loading: false, error: error.message} });
            });
    };
};