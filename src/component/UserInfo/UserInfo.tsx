import { type } from "@testing-library/user-event/dist/type";
import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTelegram } from "../../Hook/useTelegram";
import TelegramButton from "../TelegramButton/TelegramButton";



const UserInfo: React.FC = () => {
    const { tg, queryId } = useTelegram();
    const navigate = useNavigate()
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

    const onClose = () => {
        tg.close();
    }

    

    return (

        <div className="contentWrapper">
            <TelegramButton value='FAQ' onClick={() => { navigate('/faq') }} />
            <TelegramButton value='Получить консультацию по продукту' onClick={() => { navigate('/consultation') }} />
            {/*<TelegramButton value='Задать вопрос' onClick={botApi.onSendDataPresent} />*/}
        </div>

    );
}

export default UserInfo;