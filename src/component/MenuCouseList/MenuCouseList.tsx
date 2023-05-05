import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTelegram } from "../../Hook/useTelegram";
import { telegramBotUrl } from "../../constant/constant";
import './MenuCouseList.css'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { setExample } from "../../reducers/example/exampleReducer";
import { setCourseMenuStateCourse, setCourseMenuStateGroup } from "../../reducers/menu/menuStateReducer";
import { setCourseMenuLoad, setCourseMenuLoading } from "../../reducers/menu/menuDataLoadReducer";
import { CategoryCourse, CourseItem, MenuServerDataType } from "../../types/menuDataLoadTypes";
import MenuCategory from "../MenuCategory/MenuCategory";
import { MENU_GROUP_STATE } from "../../types/menuStateTypes";
import MenuItem from "../MenuItem/MenuItem";

interface Action {
    Name: string,
    Description: string,
    VCode: number,
}

/*const getTotalPrice = (items: Course[] = []) => {
    return items.reduce((acc, item) => {
        return acc += item.Price
    }, 0)
}*/

const MenuList: React.FC = () => {
    const { tg, userID } = useTelegram();

    /*const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [userName, setUserName] = useState('');*/


    const dispatch = useDispatch();
    const courseMenuState = useSelector((state: RootState) => state.courseMenu.courseMenuState);
    const courseMenuCurCetegory = useSelector((state: RootState) => state.courseMenu.courseMenuCurrent);
    const courseMenuLoading = useSelector((state: RootState) => state.courseLoad.loading);
    const courseMenuError = useSelector((state: RootState) => state.courseLoad.error);
    const courseMenuData = useSelector((state: RootState) => state.courseLoad.data);



    useEffect(() => {
        tg.ready();
        tg.MainButton.text = "Закрыть";
        tg.onEvent('mainButtonClicked', onClose);
        tg.MainButton.show();

        return () => {
            tg.offEvent('mainButtonClicked', onClose);
            //tg.MainButton.hide();
        }
    })

    useEffect(() => {
        console.log('загрузка данных с сервера')
        loadUserMenu();
    }, [])

    const onClose = () => {
        tg.close();
    }



    const loadUserMenu = async () => {
        if (courseMenuData === null) {
            dispatch(setCourseMenuLoading());
            try {
                const response = await fetch(telegramBotUrl + '/api/v2/getUserMenu/', {
                    method: 'get',
                })
                //console.log({ FAQData: data });
                if (response.status === 200) {

                    let data: MenuServerDataType = JSON.parse(await response.text());
                    console.log(data);
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

    const onAdd = (product: CourseItem) => {
        /*const alreadyAdded = addedItems.find(item => item.VCode === product.VCode);
        let newItems = [];

        if (alreadyAdded) {
            newItems = addedItems.filter(item => item.VCode !== product.VCode);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems)

        if (newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)}`
            })
        }*/
        console.log("onAdd")
        dispatch(setCourseMenuStateGroup());
    }

    const onClickCategory = (category: CategoryCourse) => {

        console.log("onClickCategory")
        dispatch(setCourseMenuStateCourse(category));
        //console.log(courseMenuData !== null && typeof courseMenuData !== 'string' && typeof courseMenuData[courseMenuCategoryCodeState]?.CourseList !== 'string' ? courseMenuData[courseMenuCategoryCodeState]?.CourseList : null);
    }

    

    return (


        <div className={'list'}>
            {
                courseMenuLoading ? <div>Идёт загрузка, пожалуйста подождите</div> :
                    <>
                        {courseMenuState === MENU_GROUP_STATE ?
                            <>
                                <div>{courseMenuState}</div>
                                {typeof courseMenuData !== 'string' && courseMenuData !== null ? courseMenuData.map(item => (
                                    <MenuCategory
                                        key={item.VCode}
                                        product={item}
                                        onClick={onClickCategory}
                                        className={'item'}
                                    />
                                )) : <div>Ошибка загрузки меню :(</div>}
                            </> :
                            <>
                                {
                                typeof courseMenuData !== 'string' && courseMenuData !== null && courseMenuCurCetegory !== null ? courseMenuCurCetegory.CourseList.map(item => (
                                    <MenuItem
                                        key={item.VCode}
                                        product={item}
                                        onAdd={onAdd}
                                        className={'item'}
                                    />
                                )) : <div>Ошибка загрузки меню :(</div>}
                            </>}
                    </>
            }
        </div>


    );
}

export default MenuList;