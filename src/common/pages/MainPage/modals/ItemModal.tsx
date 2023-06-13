import { observer } from "mobx-react-lite"
import React from "react"
import { Modal } from "../../../components"
import { useStore } from "../../../hooks"
import './ItemModal.css'

export const ItemModal: React.FC<{
  course: CourseItem
}> = observer(({ course }) => {
  const { mainPage } = useStore();
  const { itemModal } = mainPage;
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
          <button className="minus">-</button>
          <span className="count">0</span>
          <button className="plus">+</button>
        </div>
        <div className="add_to_cart_button">
          <img src="./cart.svg" alt="Добавить в корзину" />
          <span>Добавить в корзину</span>
        </div>
      </div>
    </Modal>
  )
})