import './MorePage.css';
import Страничка from '../../components/layout/Page';
import { useStore, useTelegram, useTheme } from '../../hooks';
import { ChatLight, HistoryDark, HistoryLight, LocationDark, LocationLight, MapPointsDark, MapPointsLight, ProfileDark, ProfileLight, telephone } from '../../../assets';
import { Popup, Toast, Divider, Radio, Space, Button } from 'antd-mobile';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
export const MorePage: React.FC = observer(() => {
  const tg = useTelegram();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { userStore } = useStore();
  const isdarkMode = theme === 'dark';
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
        {/* <li>
          <img src={isdarkMode ? LocationLight : LocationDark} alt="Города" />
          <select name="" id="">
            {['Уфа', 'Агидель', 'Стерлитамак', 'Белебей', 'Набережные Челны'].map((city) =>
              <option key={city} value={city}>{city}</option>
            )}
          </select>
        </li> */}
        <li>
          <img src={isdarkMode ? LocationLight : LocationDark} alt="Города" />
          <span>Уфа</span>
        </li>
        <li className='mt-1'>
          <a onClick={(e) => { 
            e.preventDefault();
            if(tg.isInTelegram()) {
              window.open('tel:89870401199'); 
            } else {
              window.open('tel:89870401199'); 
            }
          }}>
            <img src={telephone} style={{ height: '24px' }} alt="Телефон" />
            <span style={{marginLeft: '0.75rem'}}>8-987-040-11-99</span>
          </a>
        </li>
        <li>
          <a 
            onClick={(e) => { 
              e.preventDefault();
              if(tg.isInTelegram()) {
                tg.tg.openTelegramLink('https://t.me/Elipeli_operator');
              } else {
                window.open('https://t.me/Elipeli_operator'); 
              }
            }}
          >
            <button className='chatBtn'>
              <img className='chatBtn_img' src={ChatLight} alt="Написать в чат" />
              Написать в чат
            </button>
          </a>
        </li>
        <li className='mt-1' onClick={() => navigate('/profile')}>
          <img className='me-1' src={isdarkMode ? ProfileLight : ProfileDark} alt="profile" />
          Профиль (дорабатывается)
        </li>
        <li className='mt-1' onClick={() => navigate('/addrs')}>
          <img className='me-1' src={isdarkMode ? MapPointsLight : MapPointsDark} alt="Адреса доставки" />
          Адреса доставки (дорабатывается)
        </li>
        <li className='mt-1' onClick={() => navigate('/orders')}>
          <img className='me-1' src={isdarkMode ? HistoryLight : HistoryDark} alt="История заказов" />
          История заказов
        </li>
      </ul>
    </Страничка>
  )
})