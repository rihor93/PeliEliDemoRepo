import { Popup, Toast, Divider, Radio, Space } from 'antd-mobile';
import Button from 'antd-mobile/es/components/button';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { LocationDark, LocationLight } from '../../../assets';
import Страничка from '../../components/layout/Page';
import { useStore, useTheme } from '../../hooks';
import CartItem from './cartItem/CartItem';
import './CartPage.css';
import { ConfirmOrderModal } from './modals/confirmOrderModal';

export const CartPage: React.FC = observer(
  () => {
    const { theme } = useTheme();
    const { cartStore: cart, userStore } = useStore();
    const isdarkMode = theme === 'dark';
    const [askedAddr, setAskedAddr] = React.useState(0)
    return (
      <Страничка>
        <ConfirmOrderModal />
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
        <Страничка.Тело>
          {!cart.isEmpty
            ? <div style={{marginTop: '15px'}}>
              <img
                src={isdarkMode
                  ? LocationLight
                  : LocationDark
                }
                alt="выберите место получения"
              />
              <span style={{margin: '0 7px'}}>Где хотите забрать?</span>
              <select
                defaultValue={0}
                onChange={(e) => userStore.currentOrg = Number(e.target.value)}
                style={{
                  background: 'var(--фон-страницы)', 
                  color: 'var(--tg-theme-text-color)',
                  border: '1px solid var(--обводка-кнопок)',
                  borderRadius: '100px',
                  padding: '0.5rem'
                }}
              >
                <option key={0} value={0}>Точка не выбрана</option>
                {userStore.organizations.map((point) =>
                  <option key={point.Id} value={point.Id}>{point.Name}</option>
                )}
              </select>
            </div>
            : <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center'}}>
              <p>Корзина пуста 🛒</p>
            </div>
          }
          {cart.items.map((item, index) =>
            <CartItem
              key={`cart_item_${index}`}
              courseInCart={item}
              add={() => cart.addCourseToCart(item.couse)}
              remove={() => cart.removeFromCart(item.couse.VCode)}
            />
          )}
        </Страничка.Тело>
        <Button
          style={{}}
          disabled={cart.isEmpty}
          onClick={() => cart.confirmOrderModal.open()}
        >
          {`Оформить заказ за ${cart.totalPrice}`}
        </Button>
      </Страничка>
    )
  }
)

