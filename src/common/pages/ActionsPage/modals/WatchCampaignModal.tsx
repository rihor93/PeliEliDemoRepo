import React from 'react';
import { observer } from "mobx-react-lite";
import { gurmag_big } from "../../../../assets";
import { config } from "../../../configuration";
import { useStore } from "../../../hooks";
import { Optional, Undef } from "../../../types";
import './WatchCampaignModal.css';
import { Image, Popup, Space, SpinLoading } from 'antd-mobile';
import { toJS } from 'mobx';
import { useNavigate } from 'react-router-dom';
interface CampaignProp { campaign: AllCampaignUser };
const WatchCampaignModal: React.FC<CampaignProp> = observer(({ campaign }) => {

  const { actionsPage, userStore, mainPage, session } = useStore();
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

  type CampaignType = "DishDiscount" | "PercentDiscount" | "DishSetDiscount"
  let campaignType: Optional<CampaignType> = null

  if (dishDiscount && !percentDiscount && !setDish) {
    campaignDetail = dishDiscount
    campaignType = 'DishDiscount'
  };
  if (!dishDiscount && percentDiscount && !setDish) {
    campaignDetail = percentDiscount
    campaignType = "PercentDiscount"
  };
  if (!dishDiscount && !percentDiscount && setDish) {
    campaignDetail = setDish
    campaignType = "DishSetDiscount"
  };

  let text: React.ReactNode = '';
  let dishArr: Undef<CourseItem>[] = [];

  if (campaignDetail) {
    switch (campaignType) {
      case "DishDiscount": {
        campaignDetail = campaignDetail as DishDiscount
        const targetDish = mainPage.getDishByID(campaignDetail.dish)
        if (targetDish?.Name) {
          const NavigateToCourse = () => {
            mainPage.watchCourse(targetDish)
          }
          if (campaignDetail.price) {
            text = <>
              <span className='dish_link' onClick={NavigateToCourse}>
                {`👉 "${targetDish.Name}"`}
              </span>
              <span>{` за ${campaignDetail.price}руб`}</span>
            </>
          }
          if (campaignDetail.discountPercent) {
            text = <>
              <span>{`Скидка ${campaignDetail.discountPercent}%  на `}</span>
              <span className='dish_link' onClick={NavigateToCourse}>
                {`👉 ${targetDish.Name}`}
              </span>
            </>
          }
        }
        break;
      }
      case "PercentDiscount": {
        const { MaxSum, MinSum, discountPercent, bonusRate } = campaignDetail as PercentDiscount;
        text = `скидка ${discountPercent}% на сумму от ${MinSum} до ${MaxSum} руб`;
        if (bonusRate) text = text + ` + ${bonusRate} бонусных баллов`
        break;
      }
      case "PercentDiscount": {
        campaignDetail = campaignDetail as DishSetDiscount
        text = `скидка на ${campaignDetail.dishCount} блюда из списка:`;
        dishArr = campaignDetail.dishes.map((dishDiscount) =>
          mainPage.getDishByID(dishDiscount.dish)
        )
        break;
      }
      default:
        break;
    }
  }
  const navigate = useNavigate()

  return (
    <Popup
      position='right'
      visible={watchActionModal.show}
      showCloseButton
      bodyStyle={{ overflow: "scroll" }}
      style={{ zIndex: "2" }}
      onClose={() => {
        watchActionModal.close()
        navigate(-1)
      }}
    >
      <h3
        style={{
          textAlign: 'center',
          marginTop: '1rem'
        }}
      >
        {`🎁 ${campaign.Name.replace(/ *\{[^}]*\} */g, "")}!!!`}
      </h3>
      <Image
        src={config.apiURL
          + '/api/v2/image/Disount?vcode='
          + campaign.VCode
          + '&compression=true'
          + '&random='
          + session
        }
        fallback={<img src={gurmag_big} style={{
          width: 'calc(100%)',
          minHeight: 'auto',
          borderRadius: '8px'
        }} />}
        placeholder={
          <Space style={{ width: 'calc(100% - 1rem)', height: '200px', margin: '0.5rem' }} justify='center' align='center'>
            <SpinLoading color='primary' style={{ fontSize: '42px' }} />
          </Space>
        }
        fit='cover'
        style={{
          margin: '1rem 0.5rem',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          "--height": "auto",
          "--width": "calc(100% - 1rem)",
        }}
      />
      <p
        style={{
          fontSize: '22px',
          fontWeight: '400',
          lineHeight: "26px",
          margin: "20px",
          textAlign: "center"
        }}
      >
        <span>{campaign.Description.replace(/ *\{[^}]*\} */g, "") + " "}</span>
        {text}
      </p>
      <div
        style={{
          fontSize: '20px',
          margin: '0 0.75rem',
        }}
      >

        {dishArr.length ?
          <ul>
            {dishArr.map((dish, index) =>
              !dish
                ? <li style={{ marginLeft: '20px' }} key={`no_VCode_${index}`}>блюдо сейчас нет в меню</li>
                : <li key={`${dish.VCode}_${dish.VCode}_${index}ds`}>
                  <p onClick={() => {
                    const course = mainPage.getDishByID(dish.VCode)
                    if (course) {
                      mainPage.watchCourse(course)
                      actionsPage.selectedAction = null;
                    }
                  }} className='dish_link'>
                    {`👉 ${dish.Name}`}
                  </p>
                </li>
            )}
          </ul>
          : null
        }
      </div>
    </Popup>
  )
}
)
export default WatchCampaignModal;