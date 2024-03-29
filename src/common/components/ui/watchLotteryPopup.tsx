import { Popup, Steps, Button, Input, Space } from "antd-mobile"
import { Step } from "antd-mobile/es/components/steps/step"
import { FC } from "react"



export const WatchLotteryPopup: FC<{ show: boolean, close: () => void }> = ({ show, close }) => {
  const hide = () => close()
  return(
    <Popup
      position='bottom'
      visible={show}
      showCloseButton
      onClose={hide}
      onMaskClick={hide}
      style={{ zIndex: 5 }}
      bodyStyle={{ width: '100vw', height: '70vh', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
    >
      <h2 style={{ margin: '2rem 0 0 2rem' }}>Для того чтобы учавствовать:</h2>
      <Steps direction='vertical'>
        <Step
          title='1'
          status='wait'
          description={
            <Button 
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
              color='primary' 
              fill='none'
            >
              Получите номер участника розыгрыша
            </Button>
          }
        />
      </Steps>
    </Popup>
  )
}