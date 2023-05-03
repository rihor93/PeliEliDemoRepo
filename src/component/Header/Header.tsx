import React, { useEffect } from "react";
import { useTelegram } from "../../Hook/useTelegram";
import Button from "../Button/Button";
import './Header.css';




const Header = () => {
    
    const {onClose, user, tg} = useTelegram();

    return (
        <div className="header">
            <Button onClick={onClose}>Закрыть</Button>
            <span className='username'>{user}</span>
        </div>
    )

    
}

export default Header;