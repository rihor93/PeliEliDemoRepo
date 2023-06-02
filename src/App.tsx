import React from 'react';
import './App.css';
import { StoreProvider } from './common/providers';
import { Store } from './store';

function App() {
  return (
    <StoreProvider store={new Store()}>
    </StoreProvider>
  );
}

export default App;
