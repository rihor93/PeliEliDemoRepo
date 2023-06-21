import {
  Route,
  Routes,
  BrowserRouter
} from 'react-router-dom';
import React from "react";
import { Checker } from './AuthChecker';
import { CartPage, MainPage, ProfilePage } from '../pages';

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
      path: '/cart',
      private: false, // true, todo
      element: <CartPage />
    },
    {
      path: '/profile',
      private: false, // true, todo
      element: <ProfilePage />
    }
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
  </BrowserRouter>
)