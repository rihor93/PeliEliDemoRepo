import { ShoppingCartOutlined } from "@ant-design/icons"
import { Image, Space, SpinLoading, Toast } from "antd-mobile"
import { observer } from "mobx-react-lite"
import React from "react"
import { DarkMinus, DarkPlus, LightMinus, LightPlus, NoImageBig } from "../../../../assets"
import { Modal } from "../../../components"
import { config } from "../../../configuration"
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
      Toast.show({
        position: 'center', 
        content: 'Добавлено'
      })
    }
  }
  return (
    <Modal
      show={itemModal.show}
      onHide={() => itemModal.close()}
    >
      <Image 
        src={`${config.apiURL}/api/v2/image/Material?vcode=${course.VCode}`} 
        fallback={<img src={NoImageBig} style={{objectFit: 'cover', width: '100%', height: '33vh'}} onClick={() => mainPage.watchCourse(course)} />}
        placeholder={
          <Space style={{ width: '100%', height: '33vh' }} justify='center' align='center'>
            <SpinLoading color='primary' style={{fontSize: '42px'}} />
          </Space>
        }
        fit='cover'
        style={{
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          "--height": "33vh",
          "--width": "100%",
        }}
      />
      <div className="item_modal_body">
        <h1>{course.Name}</h1>
        <p>{course.CourseDescription}</p>
        {course.NoResidue 
          ? null 
          : <>
            <span>Сейчас в наличии:</span>
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
          <ShoppingCartOutlined />
          <span>Добавить в корзину</span>
        </div>
      </div>
    </Modal>
  )
})