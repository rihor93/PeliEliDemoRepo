import {
  Route,
  Routes,
  BrowserRouter
} from 'react-router-dom';
import React from "react";
import { Checker } from './AuthChecker';
import { 
  ActionsPage, 
  CartPage, 
  MainPage, 
  MenuPage, 
  MorePage, 
  ProfilePage 
} from '../../pages';
import { Toolbar } from '../../pages/MenuPage/overlays/Toolbar';

const routes: Array<{
  path: string,
  private: boolean,
  element: JSX.Element
}> = [
    {
      path: '/',
      private: false,
      element: <MainPage />
    },
    {
      path: '/menu',
      private: false,
      element: <MenuPage />
    },
    {
      path: '/menu/:catVCode/:VCode',
      private: false,
      element: <MenuPage />
    },
    {
      path: '/cart',
      private: false, // true, todo
      element: <CartPage />
    },
    {
      path: '/profile',
      private: false, // true, todo
      element: <ProfilePage />
    },
    {
      path: '/more',
      private: false, // true, todo
      element: <MorePage />
    },
    {
      path: '/actions',
      private: false, // true, todo
      element: <ActionsPage />
    },
    {
      path: '/actions/:VCode',
      private: false, // true, todo
      element: <ActionsPage />
    },
  ]

export const Router: React.FC = () => (
  <BrowserRouter>
    <Routes>
      {routes.map((route) =>
        <Route
          key={route.path}
          path={route.path}
          element={route.private
            ? <Checker>{route.element}</Checker>
            : route.element
          }
        />
      )}
    </Routes>
    
    <Toolbar />
  </BrowserRouter>
)