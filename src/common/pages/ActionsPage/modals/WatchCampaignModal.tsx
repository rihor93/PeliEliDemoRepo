import React from 'react';
import { observer } from "mobx-react-lite";
import { gurmag_big } from "../../../../assets";
import { config } from "../../../configuration";
import { useStore } from "../../../hooks";
import { Optional, Undef } from "../../../types";
import './WatchCampaignModal.css';
import { Image, Popup, Space, SpinLoading } from 'antd-mobile';
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

  // const navigate = useNavigate()

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
            <SpinLoading color='primary' style={{fontSize: '42px'}} />
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
        {`${campaign.Description.replace(/ *\{[^}]*\} */g, "")} - ${text}`}
      </p>
      <div
        style={{ 
          fontSize: '18px',
          height: '100%',
          overflow: 'scroll', 
          margin: '0 0.75rem', 
        }}
      >
         
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