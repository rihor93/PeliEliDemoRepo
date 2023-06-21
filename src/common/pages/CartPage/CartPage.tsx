import { observer } from 'mobx-react-lite';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../hooks';
import './CartPage.css';

export const CartPage: React.FC = observer(
  () => {
    const { cartStore } = useStore();
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
      <main className='cartPage'>
        <section className='cartHeader'>
          <button onClick={goBack}>{'<'}</button>
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
          <button disabled={cartStore.isEmpty} style={{ cursor: cartStore.isEmpty ? 'not-allowed' : 'pointer' }}>
            {`Оформить заказ за ${cartStore.totalPrice}`}
          </button>
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
  return (
    <div className='cartItem'>
      <img src="./gurmag.png" />
      <div className='cartItemBody'>
        <div>
          <span>{courseInCart.couse.Name}</span>
          <p>{`ценв - ${courseInCart.priceWithDiscount} руб.`}</p>
        </div>
        <div>
          <button onClick={remove} className="minus">-</button>
          <span className="count">{courseInCart.quantity}</span>
          <button onClick={add} className="plus">+</button>
        </div>
      </div>
    </div>
  )
}