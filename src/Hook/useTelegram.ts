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
        user: tg.initDataUnsafe?.user?.username,
        onToggleButton,
        queryId: tg.initDataUnsafe?.query_id,
        userID: tg.initDataUnsafe?.user?.id,
        userTgName: tg.initDataUnsafe?.user?.username,
    }

}