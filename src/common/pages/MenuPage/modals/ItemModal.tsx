import { observer } from "mobx-react-lite"
import React from "react"
import { cart, DarkMinus, DarkPlus, GurmagLogo, LightMinus, LightPlus } from "../../../../assets"
import { Modal } from "../../../components"
import { config } from "../../../configuration"
import { replaceImgSrc } from "../../../helpers"
import { useStore, useTheme } from "../../../hooks"
import './ItemModal.css'

export const ItemModal: React.FC<{
  course: CourseItem
}> = observer(({ course }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const { mainPage, cartStore } = useStore();
  const { itemModal } = mainPage;

  const [count, setCount] = React.useState(1);

  const addToCart = () => {
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        cartStore.addCourseToCart(course)
      }
      setCount(1)
      mainPage.itemModal.close()
    }
  }
  return (
    <Modal
      show={itemModal.show}
      onHide={() => itemModal.close()}
    >
      <img
        src={`${config.apiURL}/api/v2/image/Material?vcode=${course.VCode}`} 
        onError={replaceImgSrc(GurmagLogo)}
        className="item_modal_img"
      />
      <div className="item_modal_body">
        <h1>{course.Name}</h1>
        {course.NoResidue 
          ? null 
          : <>
            <span>Сегодня приготовлено:</span>
            <h2 style={{marginLeft: '1.75rem'}}>{course.EndingOcResidue}</h2>
          </>
        }
        
        <div className="count_and_price">
          <div className="row">
            <span>Количество:</span>
            <span>Стоимость:</span>
          </div>
          <div className="row">
            <div className="cout">
              <img 
                alt="Убавить" 
                className="minus" 
                src={isDarkMode ? LightMinus : DarkMinus} 
                onClick={() => setCount((prev) => (prev - 1) >= 0 ? prev - 1 : 0)} 
              />
              <span className="count">{count}</span>
              <img 
                alt="Добавить"
                className="plus" 
                src={isDarkMode ? LightPlus : DarkPlus}
                onClick={() => setCount((prev) => prev + 1)}
              />
            </div>
            <h5>{`${course.Price} ₽`}</h5>
          </div>
        </div>
        <div
          className="add_to_cart_button page_button"
          onClick={addToCart}
          style={{ cursor: count > 0 ? 'pointer' : 'not-allowed' }}
        >
          <img src={cart} alt="Добавить в корзину" />
          <span>Добавить в корзину</span>
        </div>
      </div>
    </Modal>
  )
})