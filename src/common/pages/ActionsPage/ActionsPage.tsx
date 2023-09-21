import Страничка from '../../components/layout/Page';
import './ActionsPage.css';
import React from 'react';
import { useStore } from '../../hooks';
import { food, gurmag_big } from '../../../assets';
import { observer } from 'mobx-react-lite';
import { ErrorPage } from '../../components';
import { config } from '../../configuration';
import { replaceImgSrc } from '../../helpers';
import WatchCampaignModal from './modals/WatchCampaignModal';
import { useNavigate, useParams } from 'react-router-dom';
import { Modals } from '../MenuPage/modals';
import { Button, Divider, Popup, Radio, Space, Toast } from 'antd-mobile';
import * as uuid from 'uuid'

export const ActionsPage: React.FC = observer(() => {
  const { actionsPage, userStore, auth, mainPage } = useStore();
  const { categories, visibleCategory, selectedAction, watchAction } = actionsPage;

  const { selectedCourse } = mainPage;

  const [
    isScrolled,
    setIsScrolled
  ] = React.useState(false);

  const { userName, userBonuses, allCampaign } = userStore.userState;

  React.useEffect(() => {
    function listener(e: Event) {
      // проверяем позиции всех блоков категорий,
      // чтобы найти ту, которая сейчас видна на 
      // экране
      categories.forEach((category) => {
        const el = document.getElementById(category);
        const cordinates = el?.getBoundingClientRect();

        if (cordinates) {
          // Если категория находится в видимой области
          if (cordinates.top < 200 && Math.abs(cordinates.top) + 200 < Number(el?.offsetHeight)) {
            // делаем ее активной
            if (visibleCategory !== category) {
              actionsPage.setVisibleCategory(category)
            }
          }
        }
      })
      // затем
      // по достижении какой-то кординаты
      // навбар становится фиксированным 
      // и всегда находится вверху окна
      const target = document.body.getElementsByClassName('action_types_list')[0];
      const height = target?.clientHeight;
      const targetRelTop = target?.getBoundingClientRect().top;
      const bodyRelTop = document.body.getBoundingClientRect().top;

      window.scrollY > targetRelTop - bodyRelTop + height
        ? setIsScrolled(true)
        : setIsScrolled(false)
    }

    window.addEventListener('scroll', listener)
    return () => window.removeEventListener('scroll', listener)
  }, [visibleCategory])

  const navigate = useNavigate();
  const params = useParams<{ VCode: string }>();

  React.useEffect(() => {
    if (params.VCode) {
      const campaign = userStore.getAllCampaignUserByID(params.VCode)
      if (campaign) watchAction(campaign)
    }
  }, [userStore.userState.allCampaign])

  
  const [askedAddr, setAskedAddr] = React.useState(0)
  return (
    <Страничка>
      <div style={{height: '55px'}} />
      {userStore.needAskAdress 
        ? <Popup 
            visible={userStore.needAskAdress} 
            onMaskClick={() => {
              Toast.show({
                content: 'Пожалуйста, выберите местоположение',
                position: 'center',
              })
            }}
            bodyStyle={{
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px',
              padding:'0 0.5rem 0.5rem 0.5rem'
            }}
          >
            <div>
              <Divider>Выберите вашу домашнюю кухню:</Divider>
              <Radio.Group 
                onChange={(e) => setAskedAddr(e as number)}
              >
                <Space direction='vertical' block>
                  {userStore.organizations.map((org) => 
                    <Radio block value={org.Id} key={org.Id}>
                      {org.Name}
                    </Radio>
                  )}
                </Space>
              </Radio.Group>
              <Button 
                block 
                color='primary' 
                size='large'
                className="mt-1"
                onClick={() => {
                  if(askedAddr == 142 || askedAddr == 0) {
                    Toast.show({
                      content: 'Выберите местоположение',
                      position: 'center',
                    })
                  } else {
                    userStore.currentOrg = askedAddr
                  }
                }}
              >
                Сохранить
              </Button>
            </div>
          </Popup>
        : null
      }
      {selectedAction && <WatchCampaignModal campaign={selectedAction} />}
      {selectedCourse && <Modals.course course={selectedCourse} />}
      {!userName.length
        ? <div
          className='hello_costumer'
          style={{
            background: `linear-gradient(to bottom, rgba(255, 255, 255, 0), var(--tg-theme-bg-color) 50%), url(${food})`,
            backgroundSize: 'cover',
            height: '300px',
            marginBottom: '1rem'
          }}
        >
          <h4>Кажется вы ещё не зарегестрировались в GURMAG?</h4>
          <p>Зарегестрируйтесь и получите персональные скидки и бонусы! 🎁</p>
          <button className='chatBtn mt-1'>
            Стать клиентом GURMAG
          </button>
        </div>
        : <div
          className='hello_costumer'
          style={{
            background: `linear-gradient(to bottom, rgba(255, 255, 255, 0), var(--tg-theme-bg-color) 50%), url(${food})`,
            backgroundSize: 'cover',
            height: '200px'
          }}
        >
          <h4>{`Добрый день, ${userName} 👋`}</h4>
          <p style={{ marginTop: '15px', marginBottom: '10px' }}>{`Вам доступно ${userBonuses.toFixed(2)} бонусных балов!`}</p>
        </div>
      }
      {!auth.isAuthorized
        ? <ErrorPage text='Telegram идентификатор не был получен( Кажется вы зашли сюда не через телеграм' />
        : <>
          <section className='page_action_types'>
            <ul className="action_types_list">

              {categories.map((category, index) => {
                const isActive = index === 0;
                return (
                  <li
                    className={`action_type ${isActive ? 'active' : ''}`}
                    key={`action_type_${index}`}
                    onClick={() => NavigateTo(category)}
                  >
                    {category}
                  </li>
                )
              })}
            </ul>
          </section>
          {!isScrolled
            ? null
            : (
              <section className='page_action_types overlayed2'>
                <ul className="action_types_list">

                  {categories.map((category, index) => {
                    const isActive = actionsPage.visibleCategory == category;

                    return (
                      <li
                        className={`action_type ${isActive ? 'active' : ''}`}
                        key={`fixed_action_type_${index}`}
                        onClick={() => NavigateTo(category)}
                      >
                        {category}
                      </li>
                    )
                  })}
                </ul>
              </section>
            )
          }
          <section className='actions'>
            {categories.map((category, index) =>
              <div key={category + '-' + index} id={category}>
                <h1>{category}</h1>
                <div className="actions_list">
                  {index === 0 &&
                    <p style={{ marginLeft: '20px' }}>Персональных акций нет</p>
                  }
                  {index === 1 &&
                    allCampaign.map((actia, index) =>
                      <div
                        className="action_item"
                        key={`${category}-${actia.VCode}-${index}`}
                      >
                        <img
                          className='action_img'
                          src={config.apiURL + '/api/v2/image/Disount?vcode=' + actia.VCode + '&compression=true' + '&random=' + uuid.v4()}
                          onError={replaceImgSrc(gurmag_big)}
                          onClick={() => {
                            watchAction(actia)
                            navigate('/actions/' + actia.VCode)
                          }}
                        />
                        <h3>{actia.Name.replace(/ *\{[^}]*\} */g, "")}!</h3>
                        <p>{actia.Description.replace(/ *\{[^}]*\} */g, "")}</p>
                      </div>
                    )
                  }
                </div>
              </div>
            )}

            <div style={{ height: '70px' }} />
          </section>
        </>
      }
    </Страничка>
  )
})


function NavigateTo(categoryID: string) {
  // находим относительные кординаты  
  // от видимой области экрана 
  // для нужного div 
  const el = document
    .getElementById(categoryID)
    ?.getBoundingClientRect(),
    body = document.body.getBoundingClientRect()

  // высчитываем абсолютные кординаты 
  // и скроллим окно до 
  // нужного места
  // по этим кординатам
  if (el && body) {
    // смещение по высоте, которое надо добавить 
    // из-за фиксированного меню
    let FILTERBAR_OFFSET = 90

    window.scrollTo({
      top: (el.top - body.top) - FILTERBAR_OFFSET,
      behavior: 'smooth'
    })
  }
}