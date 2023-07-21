import Страничка from '../../components/layout/Page';
import './ActionsPage.css';
import React from 'react';
import { useStore } from '../../hooks';
import { gurmag_big } from '../../../assets';
import { observer } from 'mobx-react-lite';

export const ActionsPage: React.FC = observer(() => {
  const { actionsPage, userStore } = useStore();
  const { categories, visibleCategory } = actionsPage;

  const [
    isScrolled,
    setIsScrolled
  ] = React.useState(false);

  const username = userStore.userState.userName;
  const userBosuses = userStore.userState.userBonuses;
  const userActions = userStore.userState.allCampaign;

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
  }, [visibleCategory, categories.length])

  const getOrgByID = (id: number) =>
    userStore.organizations.find((org) => org.Id === id)

  return (
    <Страничка>
      <Страничка.Заголовочек fixed backButton>
        Акции
      </Страничка.Заголовочек>
      <div style={{ height: '70px' }} />
      <div className='selectOr'>
        <p>Вы заказываете тут?</p>
        <select
          className='selectOrg_select'
          defaultValue={getOrgByID(userStore.selectedOrganizationID ?? 0)?.Name || 'Выберите точку'}
          onChange={(e) => userStore.currentOrg = Number(e.target.value)}
        >
          <option value="Выберите точку">Выберите точку</option>
          {userStore.organizations.map((org) =>
            <option value={org.Id} className='selectOrg_option'>{org.Name}</option>
          )}
        </select>
      </div>
      <section className='page_action_types'>
        <ul className="action_types_list">

          {categories.map((category, index) => {
            const isActive = actionsPage.visibleCategory == category;

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
          <section className='page_action_types overlayed'>
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

              {category !== 'Персональные'
                ? <>
                  {userActions.map((actia, index) =>
                    <div
                      className="action_item"
                      key={`${category}-${actia.VCode}-${index}`}
                    >
                      {/* todo image src */}
                      <img
                        className='action_img'
                        // todo image src
                        src={gurmag_big}
                        onClick={() => console.log('todo inclick')}
                      />
                      <h2>Акция, {actia.Name}!</h2>
                      <h2>Описание, {actia.Description}</h2>
                    </div>
                  )}
                </>
                : <>
                  <h5>{`Добрый день, ${username}`}</h5>
                  <p>{`Вам доступно ${userBosuses.toFixed(2)} бонусных балов!`}</p>
                </>
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