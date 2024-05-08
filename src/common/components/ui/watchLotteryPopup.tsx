import { Popup, Steps, Button, Toast, PasscodeInput, AutoCenter, Result, PasscodeInputRef, Input, Checkbox, Modal } from "antd-mobile"
import { CheckCircleFill, CheckCircleOutline, ClockCircleFill, CloseCircleFill } from "antd-mobile-icons"
import { Step } from "antd-mobile/es/components/steps/step"
import { ToastHandler } from "antd-mobile/es/components/toast"
import { observer } from "mobx-react-lite"
import { FC, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { http } from "../../features"
import { useStore, useTelegram, useTheme } from "../../hooks"
import { LotteryDescriptionPopupOld } from "./LotteryDescriptionPopup"

export const WatchLotteryPopupOld: FC = observer(() => {
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
      <LotteryDescriptionPopupOld 
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
                    Получите видео, чтобы узнать секретный шифр! Не нажимайте эту кнопку, если вы уже посмотрели видео и знаете секретный шифр. Сразу переходите к следующему пункту
                  </Button>
                  {/* <p style={{ lineHeight: '20px', textAlign: 'center' }}>(Если Вы уже посмотрели видео и собрали секретный код, можете сразу перейти к вводу кода)</p>
                  <p style={{ lineHeight: '20px', textAlign: 'center' }}>👇👇👇</p> */}
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



export const WatchLotteryPopup: FC = observer(function() {
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

  function sendSecretCode(code: string) {
    if(!isAgree) {
      setErroredSecretCode('Вы не прочитали условия!')
      Toast.show('Вы не приняли условия')
      return
    }
    if(auth.isFailed || !userId) {
      setErroredSecretCode('Вы не зарегистрированы')
      Toast.show('Вы не зарегистрированы')
      return
    }
    passCodeRef.current?.blur()
    setErroredSecretCode('')
    function onerror(text?: string) {
      toastRef.current?.close()
      Toast.clear()
      Toast.show(text ?? 'Ошибка')
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
              Modal.show({
                content: <p style={{ textAlign: 'center', fontSize: 20 }}>{result?.Status ?? "Что-то пошло не так("}</p>,
                closeOnMaskClick: true
              })
              setPassCode('')
            }
            toastRef.current?.close()
          }
        })
        .catch(onerror)

    } else {
      onerror('Вы не авторизованы')
    }
  }
  const { theme } = useTheme()
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
          <h2 style={{ margin: '2rem 0 0 2rem' }}>5 шагов чтобы учавствовать:</h2>
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
              status='wait'
              description={
                <Button 
                  onClick={() => { setShowDescription(true) }}
                  block 
                  color='primary' 
                  fill='none'
                  style={{ fontWeight: 600, color: theme === 'light' ? "#FD7905" : "var(--gurmag-accent-color)"}}
                >
                   Нажмите сюда, чтобы принять условия розыгрыша
                </Button>
              }
            />
            <Step 
              title='2'
              status='wait'
              description={<p style={{fontSize: 17, color: 'var(--tg-theme-text-color)', lineHeight: '22px', textIndent: 20 }}>
                Сделать покупку в приложении на <strong>любую сумму</strong> до <strong>15.06.2024</strong>
              </p>} 
            />
            <Step 
              title='3'
              status='wait'
              description={<p style={{fontSize: 17,  color: 'var(--tg-theme-text-color)', lineHeight: '22px', textIndent: 20 }}>
                <strong>Поставить оценку</strong> покупке и <strong>сделать скрин</strong> своей оценки
              </p>} 
            />
            <Step 
              title='4'
              status='wait'
              description={<p style={{fontSize: 17,  color: 'var(--tg-theme-text-color)', lineHeight: '22px', textIndent: 20 }}>
                Разместить этот скрин у себя в соцсети с отметками <strong>@gurmag_ufa</strong> и <strong>#gurmag</strong>
              </p>} 
            />
            
            <Step 
              title='5'
              status='wait'
              description={
                <Button 
                  onClick={() => {sendSecretCode('10000')}}
                  block 
                  color='primary' 
                  fill='none'
                  style={{ fontWeight: 600, color: theme === 'light' ? "#FD7905" : "var(--gurmag-accent-color)"}}
                >
                   Нажмите сюда, чтобы получить персональный номер для участия в розыгрыше
                </Button>
              } 
            />
          </Steps>
        </>
      }
    </Popup>
  )
})

interface Props { 
  show: boolean, 
  close: () => void, 
  setIsAgree: (bool: boolean) => void, 
  agree: boolean
}
const Pstyle: React.CSSProperties = {
  margin: '0.5rem 1rem', 
  fontSize: 16, 
  lineHeight: '22px',
  color: 'var(--tg-theme-text-color)',
  textIndent: '20px',
  textAlign: 'left',
  fontStyle: 'italic'
}
export const LotteryDescriptionPopup: FC<Props> = ({ show, close, agree, setIsAgree }) => {
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
              — Покупка должна быть совершена до <strong>15.06.2024</strong> в нашем телеграм-приложении
            </p>
          }
        />
        <Step 
          status="wait" 
          title={
            <p style={Pstyle}>
              — Розыгрыш будет проводиться <strong>16.06.2024</strong>
            </p>
          }
        />
        <Step
          status="wait" 
          title={
            <p style={Pstyle}>
              — Один человек может получить только один персональный номер для участия
            </p>
          }
        />
        <Step 
          status="wait" 
          title={
            <p style={Pstyle}>
              — При заказе бесплатной доставки по Уфе в некоторые районы доставка не всегда возможна по техническим причинам
            </p>
          }
        />
        <Step 
          status="wait" 
          title={
            <p style={Pstyle}>
              — Для выдачи приза все условия должны быть строго выпонены, 
              аккаунт в соцсетях должен быть <strong>открытым</strong>, 
              не должен быть фейковым или предназначенным для розыгрышей
            </p>
          }
        />
      </Steps>
      <div 
        style={{
          background: 'var(--tg-theme-secondary-bg-color)',
          borderRadius: 8,
          border: "1px solid var(--adm-border-color)",
          padding: '1rem',
          margin: '0.5rem'
        }}
      >
      <Checkbox checked={agree} onChange={val => setIsAgree(val)}>Я ознакомлен с условиями конкурса</Checkbox>
      <AutoCenter>
        <br />
        <Button onClick={hide} color='primary' fill='solid'>Вернуться и продолжить</Button>
      </AutoCenter>
      </div>
    </Popup>
  )
}