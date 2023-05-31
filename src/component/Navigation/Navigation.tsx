import { FC, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import MenuCouseList from "../MenuCouseList/MenuCouseList";
import UserInfo from "../UserInfo/UserInfo";
import CartCourseList from "../CartCourseList/CartCourseList";
import { telegramBotUrl } from "../../constant/constant";
import { MenuServerDataType } from "../../reducers/menuData/menuDataLoadTypes";
//import { AllCampaignUser, DishDiscount, DishSetDiscount, PercentDiscount, UserInfoDatas } from "../../reducers/userCart/userCartTypes";
//import { setUserInfoData } from "../../reducers/userCart/userCartReducer";
import { useTelegram } from "../../Hook/useTelegram";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import {loadMenuServerData} from "../../reducers/actions/menuDataLoadActions"
import { loadUserServerData } from "../../reducers/actions/userInfoActions";




export const Navigation: FC = () => {
    const dispatch = useDispatch();
    const currentOrg = useSelector((state: RootState) => state.userOrg.curOrg);


    useEffect(() => {
        // @ts-ignore
        dispatch(loadMenuServerData());
      }, [dispatch]);

      useEffect(() => {
        // @ts-ignore
        dispatch(loadUserServerData(currentOrg));
      }, [dispatch]);

    /*useEffect(() => {
        //console.log('загрузка данных с сервера')
        loadUserMenu();
    }, [currentOrg,])*/

    useEffect(() => {
        //console.log('загрузка данных с сервера')
        //loadUserData();
    }, [currentOrg,])


    /*const loadUserMenu = async () => {
        console.log('loadUserMenu')
        //if (courseMenuData === null && currentOrg !== undefined && currentOrg !== null && currentOrg !== 0) {
        dispatch(setCourseMenuLoading());
        try {
            const response = await fetch(telegramBotUrl + '/getUserMenu/', {
                method: 'get',
            })
            //console.log({ FAQData: data });
            if (response.status === 200) {

                let data: MenuServerDataType = JSON.parse(await response.text());
                //console.log(data);
                dispatch(setCourseMenuLoad(data));
                //const blob = await response.
                

            }

        } catch (ex) {
            console.error(ex);
            dispatch(setCourseMenuLoad(null));
        }
        //}
    }*/

    /*const loadUserData = async () => {
        console.log('loadUserData')
        //if (currentOrg === null || currentOrg === undefined) {
        try {
            const responseUserInfo = await fetch(telegramBotUrl + '/getUserInfo/' + userID + '/' + (currentOrg ? currentOrg : 'null'), {
                method: 'get',
            })
            //console.log({ FAQData: data });
            if (responseUserInfo.status === 200) {

                let dataUserInfo = JSON.parse(await responseUserInfo.text());
                //console.log(data);
                //const blob = await response.
                if (dataUserInfo !== null) {
                    let userData: UserInfoDatas = {
                        userName: dataUserInfo.UserInfo.NAME,
                        userBonuses: dataUserInfo.UserInfo.Bonuses,
                        percentDiscounts: dataUserInfo.PercentDiscount as PercentDiscount[],
                        dishDiscounts: dataUserInfo.DishDiscount as DishDiscount[],
                        allCampaign: dataUserInfo.AllDiscounts as AllCampaignUser[],
                        dishSet: dataUserInfo.SetDishDiscount as DishSetDiscount[],
                    }
                    //console.log(userData);
                    dispatch(setUserInfoData(userData));
                    dispatch(setCurOrg(dataUserInfo.UserInfo.COrg as number));
                }

            }
        } catch (ex) {
            console.error(ex);
            dispatch(setCourseMenuLoad(null));
        }
        //}
    }*/

    return (

        <Routes>
            <Route index element={<MenuCouseList />} />
            <Route path={'userInfo'} element={<UserInfo />} />
            <Route path={'cart'} element={<CartCourseList />} />
        </Routes>
    );
};

