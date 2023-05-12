import React, { useEffect } from "react";
import { useTelegram } from "../../Hook/useTelegram";
import Button from "../Button/Button";
import './Header.css';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { MENU_GROUP_STATE } from "../../types/menuStateTypes";
import { setCourseMenuStateGroup } from "../../reducers/menu/menuStateReducer";
import { useLocation, useNavigate } from "react-router-dom";




const Header = () => {
    
    const {onClose, user, tg} = useTelegram();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const courseMenuState = useSelector((state: RootState) => state.courseMenu.courseMenuState);

    const userCart = useSelector((state: RootState) => state.userCart.itemsInCart);
    const allPriceInCart = useSelector((state: RootState) => state.userCart.allPriceInCart);

    const onBack = () => {
        //console.log(location);
        if (location.pathname.indexOf('/cart') >= 0) {
            navigate('/');
        } else {
            dispatch(setCourseMenuStateGroup());
        }
    }

    function onCartClick() {
        navigate('/cart');
    }

    return (
        <div className="header container">
            {courseMenuState !== MENU_GROUP_STATE || location.pathname.indexOf('/cart') >= 0 ? <Button onClick={onBack}>Назад</Button> : <></>}
            <div onClick={onCartClick}>Элементов в конзине: {userCart.length}</div>
            <div>Цена: {allPriceInCart.toFixed(2)}</div>
            <span className='username'>{user}</span>
        </div>
    )

    
}

export default Header;