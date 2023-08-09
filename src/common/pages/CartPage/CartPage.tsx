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
    return (
      <Страничка>
      <ConfirmOrderModal />
        <Страничка.Заголовочек fixed backButton>
          Корзина
        </Страничка.Заголовочек>
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

        <Страничка.Кнопочка
          disabled={cart.isEmpty}
          onClick={() => cart.confirmOrderModal.open()}
        >
          {`Оформить заказ за ${cart.totalPrice}`}
        </Страничка.Кнопочка>
      </Страничка>
    )
  }
)

