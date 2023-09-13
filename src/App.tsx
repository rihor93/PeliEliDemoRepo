import moment from 'moment';
import 'moment/locale/ru'
import './App.css';
import { ErrorPage, Router } from './common/components';
import { config } from './common/configuration';
import { useTelegram } from './common/hooks';
import { StoreProvider, ThemeProvider } from './common/providers';
import { Store } from './store';

const store = new Store();

function App() {
  const { queryId } = useTelegram();
  if (config.useOnlyOnTg) {
    if (!queryId) {
      const errText = `
        Данные аккаунта Telegram не были получены. 
        Возможно приложение запущено не через Telegram
      `
      return <ErrorPage text={errText} />
    }
  }

  moment.locale('ru');

  return (
    <ThemeProvider>
      <StoreProvider store={store}>
        <Router />
      </StoreProvider>
    </ThemeProvider>
  );
}

export default App;
