import React from 'react';
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { gurmag_big } from "../../../../assets";
import { Modal } from "../../../components";
import { config } from "../../../configuration";
import { replaceImgSrc } from "../../../helpers";
import { useStore } from "../../../hooks";
import { Optional, Undef } from "../../../types";
import './WatchCampaignModal.css';
import * as uuid from 'uuid'
import { Popup } from 'antd-mobile';
interface CampaignProp { campaign: AllCampaignUser };
const WatchCampaignModal: React.FC<CampaignProp> = observer(({ campaign }) => {

  const { actionsPage, userStore, mainPage } = useStore();
  const { watchActionModal } = actionsPage;

  /** ищем детали для этой скидки в скидках на блюда */
  const dishDiscount = userStore.userState.dishDiscounts.find((dishDiscount) =>
    dishDiscount.vcode === campaign.VCode
  )

  /** ищем детали для этой скидки в процентных скидках */
  const percentDiscount = userStore.userState.percentDiscounts.find((percentDiscount) =>
    percentDiscount.vcode === campaign.VCode
  )

  /** ищем детали для этой скидки в скидках на сеты */
  const setDish = userStore.userState.dishSet.find((setDish) =>
    setDish.vcode === campaign.VCode
  )

  // должна найтись только одна из трех 
  let campaignDetail: Optional<DishDiscount | PercentDiscount | DishSetDiscount> = null;
  if (dishDiscount && !percentDiscount && !setDish) campaignDetail = dishDiscount;
  if (!dishDiscount && percentDiscount && !setDish) campaignDetail = percentDiscount;
  if (!dishDiscount && !percentDiscount && setDish) campaignDetail = setDish;

  let text = '';
  let dishArr: Undef<CourseItem>[] = [];

  if (campaignDetail) {
    if ('quantity' in campaignDetail) {
      const targetDish = mainPage.getDishByID(campaignDetail.dish)
      if (targetDish?.Name) {
        text = `скидка ${campaignDetail.price}руб на "${targetDish?.Name}"`
      }
    }
    if ('bonusRate' in campaignDetail) {
      const { MaxSum, MinSum, discountPercent, bonusRate } = campaignDetail;
      text = `скидка ${discountPercent}% на сумму от ${MinSum} до ${MaxSum} руб`;
      if (bonusRate) text = text + ` + ${bonusRate} бонусных баллов`
    }
    if ('dishes' in campaignDetail) {
      text = `скидка на ${campaignDetail.dishCount} блюда из списка:`;
      dishArr = campaignDetail.dishes.map((dishDiscount) =>
        mainPage.getDishByID(dishDiscount.dish)
      )
    }
  }

  const navigate = useNavigate()

  return (
    <Popup
      position='right'
      visible={watchActionModal.show}
      showCloseButton
      onClose={() => {
        watchActionModal.close()
        // navigate(-1)
      }}
    >
      <h3 
        style={{
          textAlign: 'center', 
          marginTop: '1rem'
        }}
      >
        {`🎁${campaign.Name.replace(/ *\{[^}]*\} */g, "")}!!!`}
      </h3>
      <img
        src={config.apiURL + '/api/v2/image/Disount?vcode=' + campaign.VCode + '&compression=true'  + '&random=' + uuid.v4()}
        onError={replaceImgSrc(gurmag_big)}
        style={{
          width: 'calc(100% - 1rem)', 
          height: 'auto', 
          margin: '0.5rem', 
          borderRadius: '8px'
        }}
      />
      <p>{`${campaign.Description.replace(/ *\{[^}]*\} */g, "")} - ${text}`}</p>
      {dishArr.length ?
          <ul>
            {dishArr.map((dish, index) =>
              !dish
                ? <li style={{marginLeft: '20px'}} key={`no_VCode_${index}`}>блюдо сейчас нет в меню</li>
                : <li key={`${dish.VCode}_${dish.VCode}_${index}ds`}>
                  {/* <NavLink to={`/menu/${dish.CatVCode}/${dish.VCode}`}>
                    {`- ${dish.Name}`}
                  </NavLink> */}
                  <p onClick={() => {
                    const course = mainPage.getDishByID(dish.VCode)
                    if (course) mainPage.watchCourse(course)
                  }} className='dish_link'>
                    {`👉 ${dish.Name}`}
                  </p>
                </li>
            )}
          </ul>
          : null
        }
    </Popup>
  )
}
)
export default WatchCampaignModal;