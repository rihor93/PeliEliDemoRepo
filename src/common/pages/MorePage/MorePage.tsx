import './MorePage.css';
import Страничка from '../../components/layout/Page';
import { useStore, useTelegram } from '../../hooks';
import { Popup, Toast, Divider, Radio, Space, Button } from 'antd-mobile';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { LocationFill, MessageOutline, RedoOutline, UserCircleOutline } from 'antd-mobile-icons';
import { EnvironmentOutlined, PhoneOutlined } from '@ant-design/icons';
export const MorePage: React.FC = observer(() => {
  const tg = useTelegram();
  const navigate = useNavigate();
  const { userStore } = useStore();
  const [askedAddr, setAskedAddr] = React.useState(0)
  return (
    <Страничка>
      {userStore.needAskAdress 
        ? <Popup 
            visible={userStore.needAskAdress} 
            onMaskClick={() => {
              Toast.show({
                content: 'Пожалуйста, выберите местоположение',
                position: 'center',
              })
            }}
            bodyStyle={{
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px',
              padding:'0 0.5rem 0.5rem 0.5rem'
            }}
          >
            <div>
              <Divider>Выберите вашу домашнюю кухню:</Divider>
              <Radio.Group 
                onChange={(e) => setAskedAddr(e as number)}
              >
                <Space direction='vertical' block>
                  {userStore.organizations.map((org) => 
                    <Radio block value={org.Id} key={org.Id}>
                      {org.Name}
                    </Radio>
                  )}
                </Space>
              </Radio.Group>
              <Button 
                block 
                color='primary' 
                size='large'
                className="mt-1"
                onClick={() => {
                  if(askedAddr == 142 || askedAddr == 0) {
                    Toast.show({
                      content: 'Выберите местоположение',
                      position: 'center',
                    })
                  } else {
                    userStore.currentOrg = askedAddr
                  }
                }}
              >
                Сохранить
              </Button>
            </div>
          </Popup>
        : null
      }
      <ul className='moreList'>
        <li>
          <LocationFill { ...icoProps } />
          <span>Уфа</span>
        </li>
        <li 
          className='mt-1'
          onClick={(e) => { 
            e.preventDefault();
            if(tg.isInTelegram()) {
              window.open('tel:89870401199'); 
            } else {
              window.open('tel:89870401199'); 
            }
          }}
        >
          <PhoneOutlined style={{ 
            marginRight: '10px',
            transform: 'rotate(90deg)',
            fontSize: '24px',
            color: 'var(--gurmag-accent-color)'
          }} />
          <span>8-987-040-11-99</span>
        </li>
        <li 
          className='mt-1'
          onClick={(e) => { 
            e.preventDefault();
            if(tg.isInTelegram()) {
              tg.tg.openTelegramLink('https://t.me/Elipeli_operator');
            } else {
              window.open('https://t.me/Elipeli_operator'); 
            }
          }}
        >
          <MessageOutline { ...icoProps } />
          Написать в чат
        </li>
        <li className='mt-1' onClick={() => navigate('/profile')}>
          <UserCircleOutline { ...icoProps } />
          Профиль (дорабатывается)
        </li>
        <li className='mt-1' onClick={() => navigate('/addrs')}>
          <EnvironmentOutlined { ...icoProps } />
          Адреса доставки (дорабатывается)
        </li>
        <li className='mt-1' onClick={() => navigate('/orders')}>
          <RedoOutline { ...icoProps } />
          История заказов
        </li>
      </ul>
    </Страничка>
  )
})

const icoProps = {
  style: {
    fontSize: '24px',
    color: 'var(--gurmag-accent-color)', 
    marginRight: '10px'
  }
}