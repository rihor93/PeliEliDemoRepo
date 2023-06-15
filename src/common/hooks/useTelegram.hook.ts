declare global {
  interface Window {
    Telegram: any;
  }
}

const tg = window.Telegram.WebApp;

export function useTelegram() {
  const colors = {
    bg_color: tg.themeParams.bg_color as string,
    text_color: tg.themeParams.text_color as string,
    hint_color: tg.themeParams.hint_color as string,
    button_color: tg.themeParams.button_color as string,
    button_text_color: tg.themeParams.button_text_color as string,
    secondary_bg_color: tg.themeParams.secondary_bg_color as string,
  }
  return {
    tg, 
    colors,
    user: tg.initDataUnsafe?.user, 
    userId: tg.initDataUnsafe?.user?.id, 
    queryId: tg.initDataUnsafe?.query_id, 
  }
}
// tg.initDataUnsafe?.user?.id