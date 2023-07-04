import { observer } from 'mobx-react-lite';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, useTheme } from '../../hooks';
import './CartPage.css';

export const CartPage: React.FC = observer(
  () => {
    const { cartStore } = useStore();
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    const { theme } = useTheme();

    const isDarkMode = theme === 'dark'

    return (
      <main className='cartPage'>
        <section className='cartHeader'>
          <img
            src={isDarkMode ? './BackLight.png' : './BackDark.png'}
            alt="Назад"
            onClick={goBack}
          />
          <h3>Корзина</h3>
        </section>
        <section className='cart page'>
          {cartStore.isEmpty &&
            <span>Корзина пуста</span>
          }
          {cartStore.items.map((item, index) =>
            <CartItem
              key={`cart_item_${index}`}
              courseInCart={item}
              add={() => cartStore.addCourseToCart(item.couse)}
              remove={() => cartStore.removeFromCart(item.couse.VCode)}
            />
          )}
        </section>
        <section className='cartButton'>
          <div
            className="buy_button page_button"
            style={{
              cursor: cartStore.isEmpty
                ? 'not-allowed'
                : 'pointer'
            }}
          >
            <img src="./cart.svg" />
            <span>{`Оформить заказ за ${cartStore.totalPrice}`}</span>
          </div>
        </section>
      </main>
    )
  }
)

const CartItem: React.FC<{
  courseInCart: CouseInCart,
  add: () => void,
  remove: () => void,
}> = ({ courseInCart, add, remove }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark'
  return (
    <div className='cartItem'>
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