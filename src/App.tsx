import React from 'react';
import './App.css';
import { ErrorPage, Router } from './common/components';
import { config } from './common/configuration';
import { useTelegram } from './common/hooks';
import { StoreProvider } from './common/providers';
import { Store } from './store';

function App() {
  const { queryId } = useTelegram();
  if (config.useInlyOnTg) {
    if (!queryId) {
      const errText = `
        Данные аккаунта Telegram не были получены. 
        Возможно приложение запущено не через Telegram
      `
      return <ErrorPage text={errText} />
    }
  }

  return (
    <StoreProvider store={new Store()}>
      <Router />
    </StoreProvider>
  );
}

export default App;
