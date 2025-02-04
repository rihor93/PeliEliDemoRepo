import {
  Route,
  Routes,
  BrowserRouter
} from 'react-router-dom';
import { Checker } from './AuthChecker';
import { 
  ActionsPage, 
  MainPage, 
  MenuPage, 
  MorePage, 
  OrdersPage, 
  ProfilePage, 
  AuthPage,
  CartPage
} from '../../pages';
import { CSSProperties, FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../hooks';
import { observer } from 'mobx-react-lite';
import { AddrsPage } from '../../pages/AddrsPage/AddrsPage';
import { WatchOrderDetailModal } from '../../pages/OrdersPage/WatchOrderHistory';
import { HomeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { AuthRequired } from '../ui/authRecuredBtn';

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
    {
      path: '/orders',
      private: true,
      element: <OrdersPage />
    },
    {
      path: '/orders/:VCode',
      private: true,
      element: <WatchOrderDetailModal />
    },
    {
      path: '/addrs',
      private: true,
      element: <AddrsPage />
    },
    {
      path: '/authorize',
      private: false,
      element: <AuthPage />
    },
    {
      path: '/authorize/:tel',
      private: false,
      element: <AuthPage />
    }
  ]

export const Router: FC = () => 
  <BrowserRouter>
    <div style={styles.app}>
      <div style={styles.top as CSSProperties}>
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
      <div style={styles.bottom as CSSProperties}>
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
    zIndex: '2'
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
  GiftOutline,
  MoreOutline,
  SearchOutline,
  UnorderedListOutline,
} from 'antd-mobile-icons';



const tabs = {
  top: [
    {
      key: '/',
      title: 'Главная',
    },
    {
      key: '/menu',
      title: 'Меню',
    },
    {
      key: '/actions',
      title: 'Акции',
    },
    {
      key: '/more',
      title: 'Ещё',
    },
    {
      key: '/orders',
      title: 'Заказы',
    },
    {
      key: '/addrs',
      title: 'Адреса доставки',
    },
    {
      key: '/profile',
      title: 'Профиль',
    },
    {
      key: '/login',
      title: 'Вход',
    },
    {
      key: '/authorize',
      title: 'Вход',
    }
  ], 
}

const Bottom: FC = observer(() => { 
  const { cartStore, userStore } = useStore();
  const { pathname } = useLocation();
  const { mainPage } = useStore();
  const navigate = useNavigate();

  const { state, cookstate } = mainPage

  const setRouteActive = (value: string) => {navigate(value)}

  const isHaveActions = userStore.userState.allCampaign
    .filter(al => !al.promocode)
    .length

  const bottom = [
    {
      key: '/',
      title: 'Главная',
      icon: <HomeOutlined />,
    },
    {
      key: '/menu',
      title: 'Меню',
      icon: <UnorderedListOutline />,
    },
    {
      key: '/actions',
      title: 'Акции',
      icon: <div style={{position: 'relative'}}>
        <GiftOutline />
        {!isHaveActions 
          ? null
          : <Tag
            color='primary' 
            style={{ 
              position: 'absolute',
              top: '-0.25rem', 
              right: '-0.5rem', 
              fontSize: '14px', 
              '--border-radius': '6px', 
            }}
          >
            {isHaveActions}
          </Tag>
        }
      </div>,
    },
    {
      key: '/more',
      title: 'Ещё',
      icon: <MoreOutline />,
    },
    {
      key: '/cart' , 
      title: 'Корзина' , 
      icon: <div style={{position: 'relative'}}>
        <ShoppingCartOutlined />
        {!cartStore.items.length 
          ? null
          : <Tag
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
        }
      </div>
    }
  ]

  const currentTab = bottom.find((tab) => 
    tab.key !== '/' && pathname
      .split('/')
      .includes(tab.key.replace('/', ''))
  )


  const condition = false // todo я забыл что хотел тут доделать

  return state === 'COMPLETED'
    ? <TabBar 
      activeKey={currentTab?.key} 
      onChange={value => {
        setRouteActive(value)
        window.scrollTo({top: 0 })
      }}
    >
      {bottom.map(tab => 
        <TabBar.Item key={tab.key} icon={tab.icon} title={tab.title} />
      )}
    </TabBar> 
    : preloader()
})

const Top: FC = observer(() => {
  const stor = useStore();
  
  const { pathname } = useLocation();

  const navigate = useNavigate();

  const currentTab = tabs.top.find((tab) => 
    tab.key !== '/' && pathname
      .split('/')
      .includes(tab.key.replace('/', ''))
  )

  const onBack = () => {navigate(-1)}

  const menuRightAction = (
    <div style={{ fontSize: 24 }} onClick={() => stor.setSearchInputVisible(true)}>
      <Space style={{ '--gap': '16px' }}>
        <SearchOutline />
      </Space>
    </div>
  )
  const cartRightAction = (
    <div 
      onClick={() => stor.cartStore.clearCart()} 
      style={{ color: 'grey' }}
    >
      Очистить
    </div>
  )
  const isShowRightOnMenu = pathname.split('/').includes('menu')
  const isShowRightOnCart = pathname.split('/').includes('cart')
  // для главной и для истории заказов не показываем этот навбар
  // в истории заказов будет другой навбар
  return pathname === '/' || /orders/i.test(pathname)
    ? null
    : <>
      <NavBar 
        style={{ fontWeight: '600' }}
        right={(() => {
          if(isShowRightOnMenu) return menuRightAction
          if(isShowRightOnCart) return cartRightAction
        })()} 
        onBack={onBack}
      >
        {isShowRightOnMenu && stor.searchInputVisible
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
      <AuthRequired show={stor.auth.isFailed}/>
    </>
})

const preloader = () => 
  <TabBar>
    {new Array(5).fill(null).map((_, index) => 
      <TabBar.Item 
        key={index} 
        icon={<Skeleton animated style={{width: '25px', height: '25px', borderRadius: '100px'}} />} 
        title={<Skeleton animated style={{width: '50px', height: '14px'}} />} 
      />
    )}
  </TabBar>