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
        {cart.items.map((cartItem, index) => {
          /** ищем какая скидка */
          const campaign = userStore.userState.allCampaign.find((actia) =>
            actia.VCode === cartItem.campaign
          )

          /** ищем детали для этой скидки в скидках на блюда */
          const dishDiscount = userStore.userState.dishDiscounts.find((dishDiscount) =>
            dishDiscount.vcode === cartItem.campaign
          )

          /** ищем детали для этой скидки в процентных скидках */
          const percentDiscount = userStore.userState.percentDiscounts.find((percentDiscount) =>
            percentDiscount.vcode === cartItem.campaign
          )

          /** ищем детали для этой скидки в скидках на сеты */
          const setDish = userStore.userState.dishSet.find((setDish) =>
            setDish.vcode === cartItem.campaign
          )

          // должна найтись только одна из трех 
          let campaignDetail: Optional<DishDiscount | PercentDiscount | DishSetDiscount> = null;
          if(dishDiscount && !percentDiscount && !setDish) campaignDetail = dishDiscount;
          if(!dishDiscount && percentDiscount && !setDish) campaignDetail = percentDiscount;
          if(!dishDiscount && !percentDiscount && setDish) campaignDetail = setDish;

          let infoText = '';

          if(campaignDetail) {
            if('quantity' in campaignDetail) infoText = `скидка ${campaignDetail.price}руб на ${cartItem.couse.Name}`;
            if('bonusRate' in campaignDetail) infoText = `скидка ${campaignDetail.discountPercent}% на сумму от ${campaignDetail.MinSum} до ${campaignDetail.MinSum} руб`;
            if('dishes' in campaignDetail) infoText = `скидка на сет из ${campaignDetail.dishCount} ${cartItem.couse.Name}`;
          }
          console.log('campaignDetail')
          console.log(campaignDetail)
          return (
            <div key={index}>
              <p>{cartItem.couse.Name + ' - ' + cartItem.quantity + 'шт.'}</p>
              <table>
                {campaign &&
                  <>
                    <tr>
                      <td>акция</td>
                      <td>{campaign.Name}</td>
                    </tr>
                    {campaignDetail &&
                      <tr>
                        <td>{infoText}</td>
                      </tr>
                    }
                  </>
                }
                <tr>
                  <td>цена со скидкой</td>
                  <td>{cartItem.priceWithDiscount}</td>
                </tr>
              </table>
            </div>
          )
        })}
      </div>
    </Modal>
  )
})



// const CouseInConfirm: React.FC<{
//   cartItem: CouseInCart
// }> = ({ cartItem }) => {
//   return(
//     <div></div>
//   )
// }