import Страничка from '../../components/layout/Page';
import './ActionsPage.css';
import React from 'react';
import { useStore } from '../../hooks';
import { food, gurmag_big } from '../../../assets';
import { observer } from 'mobx-react-lite';
import { config } from '../../configuration';
import WatchCampaignModal from './modals/WatchCampaignModal';
import { useNavigate, useParams } from 'react-router-dom';
import { Modals } from '../MenuPage/modals';
import { Ellipsis, Image, Skeleton } from 'antd-mobile';
import { SelectLocationPopup } from '../../components';

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
  const params = useParams<{ VCode: string }>();

  React.useEffect(() => {
    if (params.VCode) {
      const campaign = userStore.getAllCampaignUserByID(params.VCode)
      if (campaign) watchAction(campaign)
    }
  }, [userStore.userState.allCampaign])

  return (
    <Страничка>
      <div style={{ height: '55px' }} />
      {auth.isFailed
        ? <div style={{ height: '58px' }} />
        : null
      }
      {userStore.orgstate === 'COMPLETED'
        && userStore.userLoad === 'COMPLETED'
        && userStore.needAskAdress
        ? <SelectLocationPopup />
        : null
      }
      {selectedAction && <WatchCampaignModal campaign={selectedAction} />}
      {selectedCourse && <Modals.course course={selectedCourse} />}
      {userStore.orgstate === 'COMPLETED'
        && userStore.userLoad === 'COMPLETED'
        && !userName.length
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
          <section className='page_action_types overlayed2' style={{ top: auth.isFailed ? "103px" : "45px" }}>
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
                allCampaign
                  .filter(actia => !actia.promocode)
                  .map((actia, index) => <ActiaItem key={index} actia={actia} />)
              }
            </div>
          </div>
        )}

        <div style={{ height: '70px' }} />
      </section>
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

interface ActiaProps { actia: AllCampaignUser }
const ActiaItem: React.FC<ActiaProps> = observer(({ actia }) => {
  const { session, actionsPage } = useStore()
  const navigate = useNavigate()
  function WatchCampaign() {
    actionsPage.watchAction(actia)
    navigate('/actions/' + actia.VCode)
  }
  const styles = {
    img: {
      height: "204px",
      width: 'auto'
    }
  }
  return (
    <div className="action_item">
      <Image
        className='action_img'
        fallback={<img src={gurmag_big} style={styles.img} onClick={WatchCampaign} />}
        placeholder={<Skeleton style={styles.img} animated />}
        src={config.apiURL
          + '/api/v2/image/Disount?vcode='
          + actia.VCode
          + '&compression=true'
          + '&random='
          + session
        }
        onClick={WatchCampaign}
      />
      <h2>{actia.Name?.replace(/ *\{[^}]*\} */g, "")}!</h2>
      <Ellipsis
        direction='end'
        content={actia.Description?.replace(/ *\{[^}]*\} */g, "")}
        expandText='показать'
        collapseText='скрыть'
        style={{
          margin: '0 10px 5px 10px',
          fontSize: '16px'
        }}
      />
    </div>
  )
})