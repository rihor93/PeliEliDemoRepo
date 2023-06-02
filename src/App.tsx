import React from 'react';
import './App.css';
import Header from './component/Header/Header';
import { Provider } from 'react-redux';
import store from './store';
import { Navigation } from './component/Navigation/Navigation';



function App() {
  return (
    <div className="container">
      <Provider store={store}>
        <Header />
        <div className="contentContainer">
          <Navigation />
        </div>
      </Provider >
    </div >
  );
}

export default App;
