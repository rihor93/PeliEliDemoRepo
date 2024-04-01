import { Popup, Steps, Button, Input, Space, Toast } from "antd-mobile"
import { Step } from "antd-mobile/es/components/steps/step"
import { FC, useState } from "react"
import { http } from "../../features"
import { useTelegram } from "../../hooks"
import { LotteryDescriptionPopup } from "./LotteryDescriptionPopup"



export const WatchLotteryPopup: FC<{ show: boolean, close: () => void }> = ({ show, close }) => {
  const hide = () => close()
  const { userId, tg, isInTelegram } = useTelegram()
  const [showDescription, setShowDescription] = useState(false)

  function sendVideo() {
    if(userId) {
      http.post("/SendVideo", { userId }).then(() => {
        const src = 'https://t.me/Gurmagbot'
        if(isInTelegram()) {
          tg.openTelegramLink(src);
        } else {
          window.open(src); 
        }
      })
    } else { 
      Toast.show({
        content: 'Не удалось отправить видео',
        position: 'center',
      })
    }
  }
  return(
    <Popup
      position='bottom'
      visible={show}
      showCloseButton
      onClose={hide}
      onMaskClick={hide}
      style={{ zIndex: 5 }}
      bodyStyle={{ width: '100vw',  borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
    >
      <LotteryDescriptionPopup 
        close={() => { setShowDescription(false) }}
        show={showDescription}
      />
      <h3 style={{ margin: '2rem 0 0 2rem' }}>Эта форма станет активной <strong style={{ background: 'rgb(255, 241, 0)', color: 'black' }}>4 апреля в 12-00</strong>.</h3>
      <h2 style={{ margin: '2rem 0 0 2rem' }}>Для того чтобы учавствовать:</h2>
      <Steps direction='vertical'>
        <Step
          title='1'
          status='wait'
          description={
            <Button 
              onClick={() => { setShowDescription(true) }}
              block 
              color='primary' 
              fill='none'
            >
              Прочитайте условия розыгрыша
            </Button>
          }
        />
        <Step
          title='2'
          status='wait'
          description={
            <Button 
              onClick={() => { sendVideo() }}
              color='primary' 
              fill='none'
            >
              Получите видео, чтобы узнать секретный шифр!
            </Button>
          }
        />
        <Step
          title='3'
          status='wait'
          description={<>
            <p>Введите секретный шифр</p>
            <br />
            <Space>
              <Input 
              disabled
                style={{
                  width: "100%",
                  borderRadius: "100px", 
                  padding: "0.5rem 1rem",
                  fontSize: "18px",
                  border: "1px solid var(--громкий-текст)",
                  marginRight: -40
                }} 
                placeholder='Введите секретный шифр'
              />
              <Button 
              disabled
                style={{
                  borderRadius: "100px", 
                  padding: "0.5rem 1rem",
                  fontSize: "18px"
                }} 
                color='primary' 
                shape='rounded'
                fill='outline'
              >
                Отправить
              </Button>
            </Space>
          </>}
        />
        <Step
          title='4'
          status='wait'
          description={
            <Button 
            disabled
              color='primary' 
              fill='solid'
            >
              Получите номер участника розыгрыша
            </Button>
          }
        />
      </Steps>
    </Popup>
  )
}