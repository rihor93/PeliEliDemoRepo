import { observer } from 'mobx-react-lite';
import { useStore } from '../../../../hooks';
import React from 'react';
import './FilterBar.css';
import { Skeleton } from 'antd-mobile';

export const Filter: React.FC = observer(() => {
  const { mainPage, auth } = useStore();
  const {
    categories,
    visibleCategory, 
    dishSearcher
  } = mainPage;

  const [
    isScrolled,
    setIsScrolled
  ] = React.useState(false);

  React.useEffect(() => {
    function listener(e: Event) {
      // проверяем позиции всех блоков категорий,
      // чтобы найти ту, которая сейчас видна на 
      // экране
      categories.forEach((category) => {
        const el = document.getElementById(String(category.VCode));
        const cordinates = el?.getBoundingClientRect();

        if (cordinates) {
          // Если категория находится в видимой области
          if (cordinates.top < 200 && Math.abs(cordinates.top) + 200 < Number(el?.offsetHeight)) {
            // делаем ее активной
            if (visibleCategory !== String(category.VCode)) {
              mainPage.setVisibleCategory(String(category.VCode))
            }
          }
        }
      })
      // затем
      // по достижении какой-то кординаты
      // навбар становится фиксированным 
      // и всегда находится вверху окна
      const target = document.body.getElementsByClassName('filter_list')[0];
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


  if(dishSearcher.isSearching) {
    return null
  } else {
    return (
      <>
        <section className='filter page_filter'>
          <ul className="filter_list">
            {mainPage.state === 'COMPLETED'
              ? categories.map((category, index) => {
                const isActive = mainPage.visibleCategory == String(category.VCode);
    
                return (
                  <li
                    className={`filter_item ${isActive ? 'active' : ''}`}
                    key={`filter_item_${index}`}
                    onClick={() => NavigateTo(String(category.VCode))}
                  >
                    {category.Name}
                  </li>
                )
              })
              : new Array(8).fill(null).map((_, index)=> 
                <Skeleton 
                  key={index}
                  animated
                  style={{
                    width: `${Math.random() * (150 - 70) + 70}px`,
                    height: "35px", 
                    borderRadius: "24px",
                    marginBottom: "8px",
                    marginRight: "8px",
                  }} 
                />
              )
            }
          </ul>
        </section>
        {!isScrolled
          ? null
          : (
            <section className='filter page_filter overlayed' style={{ top: auth.isFailed ? "103px": "45px" }}>
              <ul className="filter_list">
  
                {categories.map((category, index) => {
                  const isActive = mainPage.visibleCategory == String(category.VCode);
  
                  return (
                    <li
                      className={`filter_item ${isActive ? 'active' : ''}`}
                      key={`fixed_filter_item_${index}`}
                      onClick={() => NavigateTo(String(category.VCode))}
                    >
                      {category.Name}
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        }
      </>
    )
  }
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
    let FILTERBAR_OFFSET = 120

    window.scrollTo({
      top: (el.top - body.top) - FILTERBAR_OFFSET,
      behavior: 'auto'
    })
  }
}