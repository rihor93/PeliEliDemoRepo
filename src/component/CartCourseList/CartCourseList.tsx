import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTelegram } from "../../Hook/useTelegram";
import { telegramBotUrl } from "../../constant/constant";
import '../OtherStyle/ListStyle.css'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { setCourseMenuStateCourse, setCourseMenuStateGroup } from "../../reducers/menu/menuStateReducer";
import { setCourseMenuLoad, setCourseMenuLoading } from "../../reducers/menu/menuDataLoadReducer";
import { CategoryCourse, CourseItem, MenuServerDataType } from "../../types/menuDataLoadTypes";
import MenuCategory from "../MenuCategory/MenuCategory";
import { MENU_GROUP_STATE } from "../../types/menuStateTypes";
import MenuItem from "../MenuItem/MenuItem";
import { addCourseToCart, dropCourseFromCart } from "../../reducers/userState/userStateReducer";



const CartCourseList: React.FC = () => {
    const { tg, userID } = useTelegram();




    const dispatch = useDispatch();
    const courseMenuState = useSelector((state: RootState) => state.courseMenu.courseMenuState);
    const itemsInCart = useSelector((state: RootState) => state.userCart.itemsInCart);



    useEffect(() => {
        tg.ready();
        tg.MainButton.text = "Заказать";
        tg.onEvent('mainButtonClicked', onClose);
        tg.MainButton.show();

        return () => {
            tg.offEvent('mainButtonClicked', onClose);
            //tg.MainButton.hide();
        }
    })


    const onClose = () => {
        tg.close();
    }



    

    const onAdd = (product: CourseItem) => {
        //console.log("onAdd")
        dispatch(addCourseToCart(product));
        //dispatch(setCourseMenuStateGroup());
    }

    const onDel= (product: CourseItem) => {
        //console.log("onDel")
        dispatch(dropCourseFromCart(product));
        //dispatch(setCourseMenuStateGroup());
    }
    return (


        <div className={'list'}>
            {itemsInCart?.length > 0 ?
            itemsInCart.map(item => (
                <MenuItem
                key={item.couse.VCode}
                product={item.couse}
                onAdd={onAdd}
                onDel={onDel}
                quantity={item.quantity}
                price={item.priceWithDiscount}
                className={'item'}

            />)) : <div>Пока корзина пуста</div>}
            
        </div>


    );
}

export default CartCourseList;