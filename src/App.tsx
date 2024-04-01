import moment from 'moment';
import 'moment/locale/ru'
import './App.css';
import { ErrorPage, Router } from './common/components';
import { config } from './common/configuration';
import { useTelegram } from './common/hooks';
import { StoreProvider, ThemeProvider } from './common/providers';
import { Store } from './store';
import React from 'react';
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
        <TestUpdater>
          <Router />
        </TestUpdater>
      </StoreProvider>
    </ThemeProvider>
  );
}

export default App;


const TestUpdater = ({ children }: { children: React.ReactNode }) => {
  const [tick, setTick] = React.useState(0)
  function handle() {
    setTick(tick + 1)
    console.log('tick')
  }
  console.log('render')
  return(
    <div style={{ position: 'relative' }} className={`ddssd${tick}`}>
      <button onClick={handle} style={{ position: 'absolute', padding: '2rem', zIndex: 1000 }}>Update Tree</button>
      {children}
    </div>
  )
}