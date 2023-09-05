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
      private: false, // true,
      element: <CartPage />
    },
    {
      path: '/profile',
      private: false, // true,
      element: <ProfilePage />
    },
    {
      path: '/more',
      private: false, // true,
      element: <MorePage />
    },
    {
      path: '/actions',
      private: false, // true,
      element: <ActionsPage />
    },
    {
      path: '/actions/:VCode',
      private: false, // true,
      element: <ActionsPage />
    },
  ]

export const Router: FC = () => 
  <BrowserRouter>
    <div style={styles.app}>
      {/* @ts-ignore */}
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
    position: 'fixed',
    left: '0',
    right: '0',
    top: '0',
    background: 'var(--tg-theme-bg-color)',
    zIndex: '1'
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


import { NavBar, SearchBar, Skeleton, Space, TabBar, Tag } from 'antd-mobile'
import {
  AppOutline,
  AppstoreOutline,
  GiftOutline,
  MoreOutline,
  SearchOutline,
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
  const { mainPage } = useStore();
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
    : mainPage.isLoading && mainPage.cookIsLoading
      ? preloader() 
      : <TabBar 
          activeKey={currentTab?.key} 
          onChange={value => {
            setRouteActive(value)
            window.scrollTo({top: 0 })
          }}
        >
          {tabs.map(item => 
            <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
          )}
          <TabBar.Item 
            key='/cart' 
            title='Корзина' 
            icon={
              <div style={{position: 'relative'}}>
                <AppstoreOutline />
                <Tag
                  color='primary' 
                  style={{ 
                    position: 'absolute',
                    top: '-0.25rem', 
                    right: '-0.5rem', 
                    fontSize: '14px', 
                    '--border-radius': '6px', 
                  }}
                >
                  {cartStore.items.length}
                </Tag>
              </div>
            }
          />
        </TabBar>
})

const Top: FC = observer(() => {
  const stor = useStore();
  
  const { pathname } = useLocation();

  const navigate = useNavigate();

  const currentTab = tabs.find((tab) => 
    tab.key !== '/' && pathname
      .split('/')
      .includes(tab.key.replace('/', ''))
  )

  const onBack = () => {navigate(-1)}

  const right = (
    <div style={{ fontSize: 24 }} onClick={() => stor.setSearchInputVisible(true)}>
      <Space style={{ '--gap': '16px' }}>
        <SearchOutline />
      </Space>
    </div>
  )
  const isShowRight = pathname.split('/').includes('menu')
  return pathname === '/'
    ? null
    : <>
      <NavBar 
        right={isShowRight ? right : null} 
        onBack={onBack}
      >
        {isShowRight && stor.searchInputVisible
          ? <SearchBar 
            style={{
              background: 'var(--tg-theme-secondary-bg-color)', 
              borderRadius: '8px'
            }}
            onChange={(e) => stor.mainPage.dishSearcher.search(e)}
            value={stor.mainPage.dishSearcher.searchTerm}
            cancelText='×' 
            placeholder='найти еду!' 
            onCancel={() => stor.setSearchInputVisible(false)}
            showCancelButton={() => true} 
          />
          : currentTab?.title ?? 'Корзина'
        }
      </NavBar>
    </>
})

const preloader = () => 
  <TabBar>
    {new Array(5).fill(null).map((_, index) => 
      <TabBar.Item 
        key={index} 
        icon={<Skeleton style={{width: '25px', height: '25px', borderRadius: '100px'}} />} 
        title={<Skeleton style={{width: '50px', height: '14px'}} />} 
      />
    )}
  </TabBar>