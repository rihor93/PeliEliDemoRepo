import { FC, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import MenuCouseList from "../MenuCouseList/MenuCouseList";
import UserInfo from "../UserInfo/UserInfo";
import CartCourseList from "../CartCourseList/CartCourseList";
import { telegramBotUrl } from "../../constant/constant";
import { setCourseMenuLoad, setCourseMenuLoading } from "../../reducers/menu/menuDataLoadReducer";
import { MenuServerDataType } from "../../types/menuDataLoadTypes";
import { AllCampaignUser, DishDiscount, DishSetDiscount, PercentDiscount, UserInfoDatas } from "../../types/userStateCourseTypes";
import { setUserInfoData } from "../../reducers/userState/userStateReducer";
import { useTelegram } from "../../Hook/useTelegram";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";




export const Navigation: FC = () => {
    const dispatch = useDispatch();
    const courseMenuData = useSelector((state: RootState) => state.courseLoad.data);
    const { tg, userID } = useTelegram();

    useEffect(() => {
        //console.log('загрузка данных с сервера')
        loadUserMenu();
    }, [])

    useEffect(() => {
        //console.log('загрузка данных с сервера')
        loadUserData();
    }, [])


    const loadUserMenu = async () => {
        if (courseMenuData === null) {
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
                    /*if (data[0].length > 0) {

                    }*/

                }

            } catch (ex) {
                console.error(ex);
                dispatch(setCourseMenuLoad(null));
            }
        }
    }

    const loadUserData = async () => {
        const responseUserInfo = await fetch(telegramBotUrl + '/getUserInfo/' + userID, {
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
            }

        }
    }

    return (

        <Routes>
            <Route index element={<MenuCouseList />} />
            <Route path={'userInfo'} element={<UserInfo />} />
            <Route path={'cart'} element={<CartCourseList />} />
        </Routes>
    );
};

function dispatch(arg0: any) {
    throw new Error("Function not implemented.");
}
