import {
  Route,
  Routes,
  BrowserRouter
} from 'react-router-dom';
import { Checker } from './AuthChecker';
import { 
  ActionsPage, 
  CartPage, 
  MainPage, 
  MenuPage, 
  MorePage, 
  ProfilePage 
} from '../../pages';
import { FC } from 'react';

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

export const Router: FC = () => 
  <BrowserRouter>
    <div style={styles.app}>
      <div style={styles.top}>
        <Top />
      </div>
      <div style={styles.body}>
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
      </div>
      {/* @ts-ignore */}
      <div style={styles.bottom}>
        <Bottom />
      </div>
    </div>
  </BrowserRouter>



const styles = {
  app: {
    height: '100vh',
    Position: 'relative'
  },
  
  top: {
    borderBottom: 'solid 1px var(--adm-color-border)',
  },
  
  body: {},
  
  bottom: { 
    borderTop: 'solid 1px var(--adm-color-border)',
    position: 'fixed',
    left: '0',
    right: '0',
    bottom: '0',
    background: 'var(--tg-theme-bg-color)'
  }
}


import { NavBar, TabBar, Tag } from 'antd-mobile'
import {
  AppOutline,
  AppstoreOutline,
  GiftOutline,
  MoreOutline,
  UnorderedListOutline,
} from 'antd-mobile-icons';

import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../hooks';
import { observer } from 'mobx-react-lite';

const tabs = [
  {
    key: '/',
    title: 'Главная',
    icon: <AppOutline />,
  },
  {
    key: '/menu',
    title: 'Меню',
    icon: <UnorderedListOutline />,
  },
  {
    key: '/actions',
    title: 'Акции',
    icon: <GiftOutline />,
  },
  {
    key: '/more',
    title: 'Ещё',
    icon: <MoreOutline />,
  }
]

const Bottom: FC = observer(() => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const setRouteActive = (value: string) => {navigate(value)}

  const currentTab = tabs.find((tab) => 
    tab.key !== '/' && pathname
      .split('/')
      .includes(tab.key.replace('/', ''))
  )

  const { cartStore } = useStore();

  const condition = false

  return condition
    ? null
    : <TabBar 
      activeKey={currentTab?.key} 
      onChange={value => setRouteActive(value)}
    >
      {tabs.map(item => 
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      )}
      <TabBar.Item 
        key='/cart'
        icon={
          <div style={{position: 'relative'}}>
            <AppstoreOutline />
            <Tag
              color='primary' 
              style={{ 
                '--border-radius': '6px', 
                position: 'absolute',
                right: '0',
              }}
            >
              {cartStore.items.length}
            </Tag>
          </div>
        }
        title='Корзина'  
      />
    </TabBar>
})

const Top: FC = () => {
  const { pathname } = useLocation();

  const navigate = useNavigate();

  const currentTab = tabs.find((tab) => 
    tab.key !== '/' && pathname
      .split('/')
      .includes(tab.key.replace('/', ''))
  )

  const onBack = () => {navigate(-1)}
  return pathname === '/'
    ? null
    : <NavBar onBack={onBack}>{currentTab?.title}</NavBar>
}