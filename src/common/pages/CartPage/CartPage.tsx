import { observer } from 'mobx-react-lite';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../hooks';
import './CartPage.css';

export const CartPage: React.FC = observer(
  () => {
    const { cartStore } = useStore();
    const navigate = useNavigate()

    return (
      <main className='cartPage'>
        <section className='cartHeader'>
          <button onClick={() => navigate(-1)}>{'<'}</button>
          <h3>Корзина</h3>
        </section>
        <section className='cart page'>
          {cartStore.isEmpty &&
            <span>Корзина пуста</span>
          }
          {cartStore.items.map((item) =>
            <CartItem courseInCart={item} />
          )}
        </section>
        <section className='cartButton'>
          <button disabled={cartStore.isEmpty}>
            {`Оформить заказ за ${cartStore.totalPrice}`}
          </button>
        </section>
      </main>
    )
  }
)

const CartItem: React.FC<{
  courseInCart: CouseInCart
}> = ({ courseInCart }) => {
  return (
    <div className='cartItem'>
      <img src="./gurmag.png" />
      <div className='cartItemBody'>
        <div>
          <span>{courseInCart.couse.Name}</span>
          <p>{`ценв - ${courseInCart.priceWithDiscount} руб.`}</p>
        </div>
        <div>
          <button className="minus">-</button>
          <span className="count">{courseInCart.quantity}</span>
          <button className="plus">+</button>
        </div>
      </div>
    </div>
  )
}