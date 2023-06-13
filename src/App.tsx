import React from 'react';
import './App.css';
import { ErrorPage, Router } from './common/components';
import { config } from './common/configuration';
import { useTelegram } from './common/hooks';
import { StoreProvider } from './common/providers';
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

  return (
    <StoreProvider store={store}>
      <Router />
    </StoreProvider>
  );
}

export default App;
