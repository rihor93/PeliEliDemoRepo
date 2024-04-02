import { Popup } from "antd-mobile"
import { Step } from "antd-mobile/es/components/steps/step"
import { Steps } from "antd-mobile/es/components/steps/steps"
import { CSSProperties, FC } from "react"

const Pstyle: CSSProperties = {
  margin: '0.5rem 1rem', 
  fontSize: 16, 
  lineHeight: '22px',
  color: 'var(--tg-theme-text-color)',
  textIndent: '20px',
  textAlign: 'left',
  fontStyle: 'italic'
}


export const LotteryDescriptionPopup: FC<{ show: boolean, close: () => void }> = ({ show, close }) => {
  const hide = () => close()
  return(
    <Popup
      position='bottom'
      visible={show}
      showCloseButton
      onClose={hide}
      onMaskClick={hide}
      style={{ zIndex: 6 }}
      bodyStyle={{ width: '100vw', height: '100vh', overflowY: 'scroll'}}
    >
      <h2 style={{ margin: '2rem 0 0 2rem' }}>Условия розыгрыша:</h2>
      <Steps 
        direction='vertical'
        style={{
          '--title-font-size': '20px',
          '--description-font-size': '15px',
        }}
      >
        <Step 
          status="wait"
          title={
            <p style={Pstyle}>
              1 — До <strong>27 апреля</strong> нужно будет просмотреть <strong>5 коротких видео</strong>, 
              в каждом видео будет показана 1 цифра секретного шифра. <br />
              Из этих цифр вам нужно будет собрать пятизначный секретный код. 
              <br />
              Кстати, видео вы можете найти в приложении Гурмага в телеграме, либо во Вконтакте.
            </p>
          }
        />
        <Step 
          status="wait" 
          title={
            <p style={Pstyle}>
              2 — Нужно будет зайти в приложение Гурмаг-ЕлиПели в телеграме 
              и указать этот секретный код
            </p>
          }
        />
        <Step
          status="wait" 
          title={
            <p style={Pstyle}>
              3 — С 28 марта до 27 апреля включительно 
              вам нужно сделать покупку в Гурмаг-ЕлиПели на сумму <strong>от 1000 рублей</strong> в одном чеке, 
              и в том же приложении получить Ваш персональный номер участника конкурса.
            </p>
          }
        />
        <Step 
          status="wait" 
          title={
            <p style={Pstyle}>
              4 — <strong>28 апреля</strong> в воскресенье в прямом эфире мы проведем розыгрыш по номерам участников. 
              Ссылки на прямой эфир будут в соцсетях и приложении.
            </p>
          }
        />
      </Steps>
      
      
      
      
    </Popup>
  )
}