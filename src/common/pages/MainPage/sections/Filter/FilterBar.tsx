import { observer } from 'mobx-react-lite';
import { useStore } from '../../../../hooks';
import React from 'react';
import './FilterBar.css';

export const Filter: React.FC = observer(() => {
  const { mainPage } = useStore();
  const {
    category_courses: categories,
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
        const el = document.getElementById(category.id);
        const cordinates = el?.getBoundingClientRect();

        if (cordinates) {
          // Если категория находится в видимой области
          if (cordinates.top < 300 && Math.abs(cordinates.top) + 300 < Number(el?.offsetHeight)) {
            // делаем ее активной
            if (visibleCategory !== category.id) {
              mainPage.setVisibleCategory(category.id)
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
  }, [visibleCategory])

  const classes = `filter page_filter ${isScrolled ? 'overlayed' : ''}`;
  return (
    <section className={classes}>
      <ul className="filter_list">
        {categories.map((category, index) => {
          const isActive = mainPage.visibleCategory == category.id
          return (
            <li
              className={`filter_item ${isActive ? 'active' : ''}`}
              key={`filter_item_${index}`}
              onClick={() => NavigateTo(category.id)}
            >
              {category.category}
            </li>
          )
        })}
      </ul>
    </section>
  )
})

function NavigateTo(categoryID: string) {
  const el = document
    .getElementById(categoryID)
    ?.getBoundingClientRect(),
    body = document.body.getBoundingClientRect()

  if (el && body) {
    window.scrollTo({
      top: el.top - body.top - 90,
      behavior: 'smooth'
    })
  }
}
