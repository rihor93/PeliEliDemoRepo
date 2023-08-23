import { useStore } from "../../../hooks";
import React from 'react'
import { observer } from "mobx-react-lite";
import { Modal } from "../../../components";
import './confirmOrderModal.css'
import { Optional } from "../../../types";

export const ConfirmOrderModal: React.FC = observer(() => {
  const { cartStore: cart, userStore, mainPage } = useStore();
  const { confirmOrderModal } = cart
  return (
    <Modal
      show={confirmOrderModal.show}
      onHide={() => confirmOrderModal.close()}
    >
      <div className="confirm_modal__body">
        <h3>Проверьте детали заказа</h3>
        {cart.items.map((cartItem, index) =>
          <CouseInConfirm key={index} cartItem={cartItem} />
        )}
        <div
          style={{ cursor: 'pointer' }}
          className="add_to_cart_button page_button"
          onClick={() => console.log('todo оформление заказа')}
        >
          <span>Оформить заказ</span>
        </div>
      </div>
    </Modal>
  )
})



const CouseInConfirm: React.FC<{
  cartItem: CouseInCart
}> = ({ cartItem }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const toggleCollapse = () => setCollapsed(!collapsed);
  const { userStore: { userState } } = useStore();

  /** ищем какая скидка */
  const campaign = userState.allCampaign.find((actia) =>
    actia.VCode === cartItem.campaign
  )

  /** ищем детали для этой скидки в скидках на блюда */
  const dishDiscount = userState.dishDiscounts.find((dishDiscount) =>
    dishDiscount.vcode === cartItem.campaign
  )

  /** ищем детали для этой скидки в процентных скидках */
  const percentDiscount = userState.percentDiscounts.find((percentDiscount) =>
    percentDiscount.vcode === cartItem.campaign
  )

  /** ищем детали для этой скидки в скидках на сеты */
  const setDish = userState.dishSet.find((setDish) =>
    setDish.vcode === cartItem.campaign
  )

  // должна найтись только одна из трех 
  let campaignDetail: Optional<DishDiscount | PercentDiscount | DishSetDiscount> = null;
  if (dishDiscount && !percentDiscount && !setDish) campaignDetail = dishDiscount;
  if (!dishDiscount && percentDiscount && !setDish) campaignDetail = percentDiscount;
  if (!dishDiscount && !percentDiscount && setDish) campaignDetail = setDish;

  let infoText = '';

  if (campaignDetail) {
    if ('quantity' in campaignDetail) infoText = `скидка ${campaignDetail.price}руб на ${cartItem.couse.Name}`;
    if ('bonusRate' in campaignDetail) infoText = `скидка ${campaignDetail.discountPercent}% на сумму от ${campaignDetail.MinSum} до ${campaignDetail.MinSum} руб`;
    if ('dishes' in campaignDetail) infoText = `скидка на сет из ${campaignDetail.dishCount} ${cartItem.couse.Name}`;
  }
  return (
    <div className="confirm_couseList_item">
      <header>
        <div>
          <span>{`"${cartItem.couse.Name}"`}</span>
          <span>{` - ${cartItem.quantity}шт.:`}</span>
        </div>
        <span style={{ fontSize: '12px' }} onClick={toggleCollapse}>{collapsed ? '▲' : '▼'}</span>
      </header>
      {!collapsed
        ? null
        : <section>
          <p>{`цена со скидкой ${cartItem.priceWithDiscount}`}</p>
          {campaign &&
            <table>
              <tbody>
                <tr>
                  <td>акция</td>
                  <td>{campaign.Name + campaignDetail ? infoText : ''}</td>
                </tr>
                <tr>
                  <td>цена со скидкой в меню</td>
                  <td>{cartItem.couse.Price}</td>
                </tr>
                <tr>
                  <td>цена без скидки</td>
                  <td>{cartItem.couse.Price}</td>
                </tr>
              </tbody>
            </table>
          }
        </section>
      }
    </div>
  )
}