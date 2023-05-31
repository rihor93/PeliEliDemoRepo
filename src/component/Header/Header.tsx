import React, { useEffect, useMemo, useState } from "react";
import { useTelegram } from "../../Hook/useTelegram";
import Button from "../Button/Button";
import './Header.css';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { MENU_GROUP_STATE } from "../../reducers/menuState/menuStateTypes";
import { setCourseMenuStateGroup } from "../../reducers/menuState/menuStateReducer";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Dropdown from "../DropDown/Dropdown";
import DropdownMenu from "../DropDown/DropdownMenu";



const Header = () => {

    const { onClose, user, tg } = useTelegram();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const courseMenuState = useSelector((state: RootState) => state.courseMenu.courseMenuState);

    const userCart = useSelector((state: RootState) => state.userCart.itemsInCart);
    const allPriceInCart = useSelector((state: RootState) => state.userCart.allPriceInCart);

    const onBack = () => {
        console.log(location);
        if (showBackButton()) {
            navigate('/');
        } else {
            dispatch(setCourseMenuStateGroup());
        }
    }

    function onCartClick() {
        //dispatch(setCurOrg(145));
        navigate('/cart');
    }

    function onUserClick() {
        navigate('/userInfo');
    }

    function showBackButton() {
        return (location.pathname.indexOf('/cart') >= 0) || (location.pathname.indexOf('/userInfo') >= 0);
    }


    const options = [
        { value: 'option1', label: 'Option 1', id: 1 },
        { value: 'option2', label: 'Option 2', id: 2 },
        { value: 'option3', label: 'Option 3', id: 3 },
    ];


    return (
        <div className="header container">
                <DropdownMenu />
                {courseMenuState !== MENU_GROUP_STATE || showBackButton() ? <Button onClick={onBack}>Назад</Button> : <></>}
                <div onClick={onCartClick}>Элементов в конзине: {userCart.length}</div>
                <div>Цена: {allPriceInCart.toFixed(2)}</div>
                <span className='username' onClick={onUserClick}>{user}</span>
            
                
            
        </div>
    )


}

const Label = styled.div`
  border-radius: 3px;
  background-color: "#eee";
  padding: 5px 10px;
`;

export default Header;