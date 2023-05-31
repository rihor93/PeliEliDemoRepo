import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTelegram } from "../../Hook/useTelegram";
import { telegramBotUrl } from "../../constant/constant";
import '../OtherStyle/ListStyle.css'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { CourseItem } from "../../reducers/menuData/menuDataLoadTypes";
import MenuItem from "../MenuItem/MenuItem";
import { addCourseToCart, dropCourseFromCart } from "../../reducers/actions/userCartActions";



const CartCourseList: React.FC = () => {
    const { tg, userID } = useTelegram();




    const dispatch = useDispatch();
    const courseMenuState = useSelector((state: RootState) => state.courseMenu.courseMenuState);
    const itemsInCart = useSelector((state: RootState) => state.userCart.itemsInCart);
    const userInfo = useSelector((state: RootState)=>state.userInfo.data);



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
        dispatch(addCourseToCart(product,userInfo));
        //dispatch(setCourseMenuStateGroup());
    }

    const onDel= (product: CourseItem) => {
        //console.log("onDel")
        dispatch(dropCourseFromCart(product,userInfo));
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