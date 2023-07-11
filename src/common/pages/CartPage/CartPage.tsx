import { observer } from 'mobx-react-lite';
import React from 'react';
import Страничка from '../../components/layout/Page';
import { useStore, useTheme } from '../../hooks';
import './CartPage.css';

export const CartPage: React.FC = observer(
  () => {
    const { cartStore: cart } = useStore();
    return (
      <Страничка>
        <Страничка.Заголовочек fixed backButton>
          Корзина
        </Страничка.Заголовочек>
        <Страничка.Тело>
          {!cart.isEmpty 
            ? null
            : <span>Корзина пуста</span>
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
          onClick={() => console.log('todo - оформление заказа')}
        >
          {`Оформить заказ за ${cart.totalPrice}`}
        </Страничка.Кнопочка>
      </Страничка>
    )
  }
)

const CartItem: React.FC<{
  courseInCart: CouseInCart,
  add: () => void,
  remove: () => void,
}> = ({ courseInCart, add, remove }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const onClose = () => {
    for (let i = 0; i < courseInCart.quantity; i++) {
      remove()
    }
  }
  return (
    <div className='cartItem'>
      <img
        onClick={onClose}
        className='closeButton'
        src={isDarkMode
          ? './CrossLight.png'
          : './CrossDark.png'
        }
      />
      <img src="./gurmag.png" />
      <div className='cartItemBody'>
        <div>
          <span>{courseInCart.couse.Name}</span>
        </div>
        <div className="row">
          <div className="cout">
            <img
              alt="Убавить"
              className="minus"
              src={isDarkMode ? 'LightMinus.png' : 'DarkMinus.png'}
              onClick={remove}
            />
            <span className="count">{courseInCart.quantity}</span>
            <img
              alt="Добавить"
              className="plus"
              src={isDarkMode ? './LightPlus.png' : './DarkPlus.png'}
              onClick={add}
            />
          </div>
          <h5>{`${courseInCart.priceWithDiscount} ₽`}</h5>
        </div>
      </div>
    </div>
  )
}