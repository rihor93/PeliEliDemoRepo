import { Dispatch } from 'redux';
import axios from 'axios';
import { telegramBotUrl } from '../../constant/constant';
import { AllCampaignUser, DishDiscount, DishSetDiscount, FETCH_DATA_FAILURE, FETCH_DATA_REQUEST, FETCH_DATA_SUCCESS, PercentDiscount, UserInfoState } from '../userInfo/userInfoTypes';
import { useTelegram } from '../../Hook/useTelegram';
import { SET_CURRENT_ORG } from '../currentOrg/currentOrgTypes';
import { setCurOrg } from './currentOrgActions';
import { applyDiscountForCart } from './userCartActions';


const { userID } = useTelegram();

export const loadUserServerData = (orgId: number) => {
    //console.log('loadUserServerData')
    //const currentOrg = useSelector((state: RootState) => state.userOrg.curOrg);
    
    return (dispatch: Dispatch) => {
        dispatch({ type: FETCH_DATA_REQUEST, });
        axios.get(telegramBotUrl + '/getUserInfo/' + userID + '/' + orgId)
            .then(response => {
                const dataUserInfo = response.data;
                let userData: UserInfoState = {
                    userName: dataUserInfo.UserInfo.NAME,
                    userBonuses: dataUserInfo.UserInfo.Bonuses,
                    percentDiscounts: dataUserInfo.PercentDiscount as PercentDiscount[],
                    dishDiscounts: dataUserInfo.DishDiscount as DishDiscount[],
                    allCampaign: dataUserInfo.AllDiscounts as AllCampaignUser[],
                    dishSet: dataUserInfo.SetDishDiscount as DishSetDiscount[],
                }
                dispatch({
                    type: FETCH_DATA_SUCCESS,
                    payload: {loading: false, error: 'userInfo', data: userData},
                })
                
                dispatch(setCurOrg(dataUserInfo.UserInfo.COrg as number));
                dispatch(applyDiscountForCart(userData));
                //console.log('loadUserServerData',response.data);
            })
            .catch(error => {
                dispatch({ type: FETCH_DATA_FAILURE, payload: {loading: false, error: error.message} });
            });
    };
};