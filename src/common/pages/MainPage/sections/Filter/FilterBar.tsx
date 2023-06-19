import { observer } from 'mobx-react-lite';
import { useStore } from '../../../../hooks';
import React from 'react';
import './FilterBar.css';

export const Filter: React.FC = observer(() => {
  const { mainPage } = useStore();
  const {
    categories,
    visibleCategory
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
          if (cordinates.top < 300 && Math.abs(cordinates.top) + 300 < Number(el?.offsetHeight)) {
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
      window.scrollY > 360 // сделать по другому todo
        ? setIsScrolled(true)
        : setIsScrolled(false)
    }

    window.addEventListener('scroll', listener)
    return () => window.removeEventListener('scroll', listener)
  }, [visibleCategory, categories.length])

  const classes = [
    'filter',
    'page_filter',
    isScrolled
      ? 'overlayed'
      : ''
  ]



  return (
    <section className={classes.join(' ')}>
      <ul className="filter_list">

        {categories.map((category, index) => {
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
        })}
      </ul>
    </section>
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

    // если высота фиксированного меню > 100px 
    // значит мы находимся вначале 
    // и меню развернуто, 
    // это нужно учесть в том месте куда будем пролистывать,
    // где меню будет автоматически свернуто 
    const height = document.body.getElementsByClassName('filter_list')[0]?.clientHeight

    if(height > 100) {
      FILTERBAR_OFFSET = FILTERBAR_OFFSET + height
    }
    window.scrollTo({
      top: (el.top - body.top) - FILTERBAR_OFFSET,
      behavior: 'smooth'
    })
  }
}