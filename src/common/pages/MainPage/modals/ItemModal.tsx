import { observer } from "mobx-react-lite"
import React from "react"
import { Modal } from "../../../components"
import { useStore } from "../../../hooks"
import './ItemModal.css'

export const ItemModal: React.FC<{
  course: CourseItem
}> = observer(({ course }) => {
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
        src="./gurmag.png" // todo there 
        className="item_modal_img"
      />
      <div className="item_modal_body">
        <div
          className="close_button"
          onClick={() => itemModal.close()}
        >
          +
        </div>
        <h1>{course.Name}</h1>
        <span>Стоимость:</span>
        <br />
        <span className="total_price">{course.Discount_Price}</span>
        <br />
        <span>Тип:</span>
        <div className="available_types">
          {/* todo src img here */}
          {/* todo as select option */}
          <img className="selected" src="./gurmag.png" />
          <img src="./gurmag.png" />
          <img src="./gurmag.png" />
          <img src="./gurmag.png" />
          <img src="./gurmag.png" />
        </div>
        <span>Количество:</span>
        <div className="select_count">
          <button
            className="minus"
            onClick={() => setCount((prev) => (prev - 1) >= 0 ? prev - 1 : 0)}
          >
            -
          </button>
          <span className="count">{count}</span>
          <button
            className="plus"
            onClick={() => setCount((prev) => prev + 1)}
          >
            +
          </button>
        </div>
        <div
          className="add_to_cart_button"
          onClick={addToCart}
          style={{cursor: count > 0 ? 'pointer' : 'not-allowed'}}
        >
          <img src="./cart.svg" alt="Добавить в корзину" />
          <span>Добавить в корзину</span>
        </div>
      </div>
    </Modal>
  )
})