import { Popup, Steps, Button, Toast, PasscodeInput, AutoCenter, Result, PasscodeInputRef, Input, Checkbox } from "antd-mobile"
import { CheckCircleFill, CheckCircleOutline, ClockCircleFill, CloseCircleFill } from "antd-mobile-icons"
import { Step } from "antd-mobile/es/components/steps/step"
import { ToastHandler } from "antd-mobile/es/components/toast"
import { observer } from "mobx-react-lite"
import { FC, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { http } from "../../features"
import { useStore, useTelegram } from "../../hooks"
import { LotteryDescriptionPopup } from "./LotteryDescriptionPopup"

export const WatchLotteryPopup: FC = observer(() => {
  const navigate = useNavigate()
  const { iPhone15Lottery, auth } = useStore()
  const {
    IsEngageInLottery, 
    engageNumber, 
    watchLotteryPopup, 
    points, 
    setPointComleted
  } = iPhone15Lottery;

  const hide = () => watchLotteryPopup.close()
  
  const { userId, tg, isInTelegram } = useTelegram()
  const [showDescription, setShowDescription] = useState(false)
  /** тост с загрузкой */
  const toastRef = useRef<ToastHandler>()
  const passCodeRef = useRef<PasscodeInputRef>(null)

  const [passCode, setPassCode] = useState('')
  const [erroredSecretCode, setErroredSecretCode] = useState('')
  const [isAgree, setIsAgree] = useState(points[1])

  

  function sendVideo() {
    toastRef.current = Toast.show({
      icon: 'loading',
      content: 'Отправляем видео',
      position: 'center', 
      duration: 0 // висит бесконечно
    })
    if(userId) {
      http.post("/SendVideo", { userId }).then(() => {
        const src = 'https://t.me/Gurmagbot'
        toastRef.current?.close()
        if(isInTelegram()) {
          tg.openTelegramLink(src);
          tg.close()
        } else {
          window.open(src); 
        }
        setPointComleted(1, true)
        setPointComleted(2, true)
      }).catch(() => {
        Toast.show({
          content: 'Не удалось получить видео',
          position: 'center',
        })
      })
    } else { 
      toastRef.current?.close()
      Toast.show({
        content: 'Не удалось получить видео',
        position: 'center',
      })
    }
  }

  function sendSecretCode(code: string) {
    if(!isAgree) {
      setErroredSecretCode('Вы не прочитали условия!')
      return
    }
    passCodeRef.current?.blur()
    setErroredSecretCode('')
    function onerror() {
      toastRef.current?.close()
      Toast.show({
        content: 'Не удалось отправить секретный код',
        position: 'center',
      })
    }

    toastRef.current = Toast.show({
      icon: 'loading',
      content: 'Отправляем код',
      position: 'center', 
      duration: 0 // висит бесконечно
    })
    if(userId) {
      http
        .post("/RegActionNumber", { userId, code })
        .then((result: any) => {
          if(result?.Number && result.Number > 0) {
            toastRef.current?.close()
            iPhone15Lottery.setIsEngageInLottery(true)
            iPhone15Lottery.setEngageNumber(result.Number)
            setPointComleted(1, true)
            setPointComleted(2, true)
            setPointComleted(3, true)
          } else {
            if(result?.Status === "Сумма покупок недостаточна") {
              toastRef.current?.close()
              setErroredSecretCode("Сумма покупок недостаточна")
              iPhone15Lottery.setIsEngageInLottery(false)
            } else if(result?.Status === "Код введён неверно") {
              toastRef.current?.close()
              setErroredSecretCode("Код введён неверно")
              iPhone15Lottery.setIsEngageInLottery(false)
              setPassCode('')
            } else {
              toastRef.current?.close()
              setErroredSecretCode(result?.Status ?? "Что-то пошло не так(")
              iPhone15Lottery.setIsEngageInLottery(false)
              setPassCode('')
            }
            toastRef.current?.close()
          }
        })
        .catch(onerror)

    } else {
      onerror()
    }
  }
  return(
    <Popup
      position='bottom'
      visible={watchLotteryPopup.show}
      showCloseButton
      onClose={hide}
      onMaskClick={hide}
      style={{ zIndex: 5 }}
      bodyStyle={{ width: '100vw',  borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
    >
      <LotteryDescriptionPopup 
        close={() => { 
          setShowDescription(false)
        }}
        agree={isAgree}
        setIsAgree={bool => {
          setIsAgree(bool)
          setPointComleted(1, bool)
        }}
        show={showDescription}
      />
      {IsEngageInLottery && engageNumber && engageNumber > 0
        ? <>
          <h2 style={{ margin: '2rem 0 0 2rem' }}>Вы уже учавствуете!</h2>
          <Result
            icon={<CheckCircleOutline style={{ fontSize: 64 }} />}
            status='success'
            title={<>
              <p>Ваш номер: <strong style={{ color: 'var(--gurmag-accent-color)', fontSize: '30px' }}>{engageNumber}</strong>.</p>
              <p>Осталось дождаться результатов розыгрыша</p>
            </>}
          />
        </>
        : <> 
          <h2 style={{ margin: '2rem 0 0 2rem' }}>Для того чтобы учавствовать:</h2>
          <Steps 
            direction='vertical'
            style={{
              '--title-font-size': '20px',
              '--description-font-size': '15px',
              '--indicator-margin-right': '12px',
              '--icon-size': '22px',
            }}
          >
            <Step
              title='1'
              status={ points[1] 
                ? 'finish'
                : !points[2] && !points[3] && !points[4]
                  ? 'process'
                  : 'wait'
              }
              icon={ points[1] 
                ? <CheckCircleFill /> 
                : !points[2] && !points[3] && !points[4] 
                  ? <ClockCircleFill />
                  : <CloseCircleFill />
              }
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
              status={ points[2] 
                ? 'finish'
                : points[1]
                  ? 'process'
                  : 'wait'
              }
              icon={ points[2] 
                ? <CheckCircleFill /> 
                : points[1]
                  ? <ClockCircleFill />
                  : <CloseCircleFill />
              }
              description={
                <>
                  <Button 
                    disabled={!isAgree}
                    onClick={() => {
                      if(auth.isFailed) {
                        navigate('/authorize')
                      } else {
                        sendVideo()
                      }
                    }}
                    color='primary' 
                    fill='none'
                    block
                  >
                    Получите видео, чтобы узнать секретный шифр!
                  </Button>
                  <p style={{ lineHeight: '20px', textAlign: 'center' }}>(Если Вы уже посмотрели видео и собрали секретный код, можете сразу перейти к вводу кода)</p>
                  <p style={{ lineHeight: '20px', textAlign: 'center' }}>👇👇👇</p>
                </>
              }
            />
            <Step
              title='3'
              status={ points[3] 
                ? 'finish'
                : points[2] && points[1]
                  ? 'process'
                  : 'wait'
              }
              icon={ points[3] 
                ? <CheckCircleFill /> 
                : points[2] && points[1]
                  ? <ClockCircleFill />
                  : <CloseCircleFill />
              }
              description={<>
                <AutoCenter>
                  <h3>
                    <center>
                      Введите секретный шифр и получите номер участника розыгрыша
                    </center>
                  </h3>
                  <br />
                  <center>
                    <PasscodeInput 
                      key='PasscodeInput_UniqueKey228'
                      ref={passCodeRef}
                      plain
                      value={passCode}
                      onChange={val => {
                        setPointComleted(1, true)
                        setPointComleted(2, true)
                        setPassCode(val)
                      }}
                      length={5}
                      style={{ 
                        borderColor: 'var(--tg-theme-text-color)', 
                        "--border-color": 'var(--tg-theme-text-color)'
                      }} 
                      onFill={sendSecretCode}
                    />
                  </center>
                </AutoCenter>
                {!erroredSecretCode.length 
                  ? null
                  : <div 
                    style={{
                      color: 'black', 
                      width: "100%",
                      fontSize: "18px", 
                      fontWeight: "400",
                      textTransform: "uppercase", 
                      padding: "18px", 
                      background: "#FFF100", 
                      borderRadius: "8px",
                      margin: '1rem 0'
                    }} 
                  >
                    {erroredSecretCode}
                  </div>
                }
              </>}
            />
          </Steps>
        </>
      }
    </Popup>
  )
})