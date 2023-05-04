import React, { useEffect, useState } from 'react';
import './App.css';
import { MainButton, useThemeParams } from '@vkruglikov/react-telegram-web-app';
import { ConfigProvider, theme } from 'antd';
import { Route, Routes } from 'react-router-dom';
import UserInfo from './component/UserInfo/UserInfo';
import Header from './component/Header/Header';
import MenuCouseList from './component/MenuCouseList/MenuCouseList';



function App() {

  const [colorScheme, themeParams] = useThemeParams();
  console.log('app')
  return (
    <div className="container">
      <Header></Header>
      <ConfigProvider
        theme={
          themeParams.text_color
            ? {
              algorithm:
                colorScheme === 'dark'
                  ? theme.darkAlgorithm
                  : theme.defaultAlgorithm,
              token: {
                colorText: themeParams.text_color,
                colorPrimary: themeParams.button_color,
                colorBgBase: themeParams.bg_color,
              },
            }
            : undefined
        }
      >
        <Routes>
          <Route index element={<MenuCouseList />} />
          <Route path={'userInfo'} element={<UserInfo />} />
        </Routes>
      </ConfigProvider>

    </div>
  );
}

export default App;
