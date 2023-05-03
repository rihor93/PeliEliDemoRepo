import { useDebug } from "../constant/constant";

// @ts-ignore
const tg = window.Telegram.WebApp;

export function useTelegram() {

    const onClose = () => {
        tg.close();
    }

    const onToggleButton = () => {
        if (!tg.MainButton.isVisible) {
            tg.MainButton.show();
        } else {
            tg.MainButton.hide();
        }
    }

    return {
        onClose,
        tg,
        user: useDebug ? 'alex' : tg.initDataUnsafe?.user?.username,
        onToggleButton,
        queryId: useDebug ? '0' : tg.initDataUnsafe?.query_id,
        userID: useDebug ? '187151411' : tg.initDataUnsafe?.user?.id,
        userTgName: useDebug ? 'alex' : tg.initDataUnsafe?.user?.username,
    }

}