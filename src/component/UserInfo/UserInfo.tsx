import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTelegram } from "../../Hook/useTelegram";
import ActionCard from "./ActionCard";
import UserCard from "./UserCard";
import { telegramBotUrl } from "../../constant/constant";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";

interface Action {
    Name: string,
    Description: string,
    VCode: number,
}

const UserInfo: React.FC = () => {
    const { tg, userID } = useTelegram();

    //const [userName, setUserName] = useState('');
    //const [userBosuses, setUserBosuses] = useState('');
    //const [userAuthorized, setUserAuthorized] = useState(false);
    //const [userActions, setUserActions] = useState<Action[]>();
    const userName = useSelector((state: RootState) => state.userCart.userInfo?.userName);
    const userBosuses = useSelector((state: RootState) => state.userCart.userInfo?.userBonuses);
    const userActions = useSelector((state: RootState) => state.userCart.userInfo?.allCampaign);
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

    /*useEffect(() => {
        //console.log('загрузка данных с сервера')
        loadUserInfo();
    }, [])*/

    const onClose = () => {
        tg.close();
    }

    /*const loadUserInfo = async () => {
        try {
            const response = await fetch(telegramBotUrl + '/getUserInfo/' + userID, {
                method: 'get',
            })
            //console.log({ FAQData: data });
            if (response.status === 200) {

                let data = JSON.parse(await response.text());
                //console.log(data);
                //const blob = await response.
                if (data !== null) {
                    setUserAuthorized(true);
                    setUserName(data.UserInfo.NAME)
                    setUserBosuses(data.UserInfo.Bonuses.toFixed(2))
                }
                setUserActions(data.AllDiscounts)
                setLoading(false);
            }
        } catch (ex) {
            console.error(ex);
            setError(true);
        }
    }*/

    return (

        <div className="contentWrapper">

            <div>
                {(userName !== null && userName !== undefined && userBosuses !== undefined ? <div>{<UserCard name={userName} bonuses={userBosuses.toFixed(2)} />}</div> : <div><h1>К сожалению, вы еще не завели карточку в нашей кулинарии</h1></div>)}
                <div>
                    <div><h1>Акции, специально для вас</h1></div>
                    <div>
                        {userActions?.map((act, i) => {
                            return <ActionCard key={act.VCode} name={act.Name} description={act.Description}></ActionCard>
                        })}
                    </div>
                </div>
            </div>

            {/*<TelegramButton value='FAQ' onClick={() => { navigate('/faq') }} />
            <TelegramButton value='Получить консультацию по продукту' onClick={() => { navigate('/consultation') }} />*/}
            {/*<TelegramButton value='Задать вопрос' onClick={botApi.onSendDataPresent} />*/}
        </div>

    );
}

export default UserInfo;