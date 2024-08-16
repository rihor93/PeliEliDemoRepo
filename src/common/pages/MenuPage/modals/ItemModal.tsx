import { ShoppingCartOutlined } from "@ant-design/icons"
import { Image, Space, SpinLoading, Swiper, Toast } from "antd-mobile"
import { observer } from "mobx-react-lite"
import React from "react"
import { DarkMinus, DarkPlus, LightMinus, LightPlus, NoImageBig } from "../../../../assets"
import { Modal } from "../../../components"
import { config } from "../../../configuration"
import { isDevelopment } from "../../../helpers"
import { useStore, useTheme } from "../../../hooks"
import './ItemModal.css'
import Metrics from "../../../../store/stores/Metriks"

export const ItemModal: React.FC<{
  course: CourseItem
}> = observer(({ course }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const { mainPage, cartStore, session } = useStore();
  const { itemModal } = mainPage;

  const [count, setCount] = React.useState(1);

  const addToCart = () => {
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        cartStore.addCourseToCart(course)
        Metrics.addToCart(course.VCode, course.Price)
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
      <Swiper
        indicator={(total, current) => (
          <div style={{
            position: "absolute",
            top: 6,
            background: "rgba(0, 0, 0, 0.3)",
            padding: "4px 8px",
            color: "#ffffff",
            borderRadius: 4,
            userSelect: "none",
          }}>
            {`${current + 1} / ${total}`}
          </div>
        )
        }
      >
        {course.CompressImages && course.CompressImages.length
          ? course.CompressImages.map(image =>
            <Swiper.Item key={image}>
              <Image
                src={
                  config.apiURL
                    + "/api/v2/image/FileImage?fileId="
                    + image
                }
                fallback={<img src={NoImageBig} style={{ objectFit: 'cover', width: '100%', height: '33vh' }} onClick={() => mainPage.watchCourse(course)} />}
                placeholder={
                  <Space style={{ width: '100%', height: '33vh' }} justify='center' align='center'>
                    <SpinLoading color='primary' style={{ fontSize: '42px' }} />
                  </Space>
                }
                fit='contain'
                style={{
                  borderTopLeftRadius: '8px',
                  borderTopRightRadius: '8px',
                  "--height": "47vh",
                  "--width": "100%",
                }}
              />
            </Swiper.Item>
          )
          : <Swiper.Item>
            <Image
              src={config.apiURL
                + "/api/v2/image/Material?vcode="
                + course.VCode
                + "&random="
                + session
              }
              fallback={<img src={NoImageBig} style={{ objectFit: 'cover', width: '100%', height: '33vh' }} onClick={() => mainPage.watchCourse(course)} />}
              placeholder={
                <Space style={{ width: '100%', height: '33vh' }} justify='center' align='center'>
                  <SpinLoading color='primary' style={{ fontSize: '42px' }} />
                </Space>
              }
              fit='contain'
              style={{
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
                "--height": "47vh",
                "--width": "100%",
              }}
            />
          </Swiper.Item>
        }

      </Swiper>

      <div className="item_modal_body">
        <h1>{course.Name}</h1>
        <p>{course.CourseDescription}</p>
        {course.NoResidue
          ? null
          : <>
            <span>Сейчас в наличии:</span>
            <h2 style={{ marginLeft: '1.75rem' }}>{course.EndingOcResidue}</h2>
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
    </Modal >
  )
})