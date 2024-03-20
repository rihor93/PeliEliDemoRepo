import { Dialog } from "antd-mobile";
import { ExclamationCircleFill, GiftOutline } from "antd-mobile-icons";
import { makeAutoObservable } from "mobx";
import { http, logger } from "../../common/features";
import { useTelegram } from "../../common/hooks";
import { Optional } from "../../common/types";
import { Store } from "../RootStore";

export const AuthStates = {
  CHECKING_AUTH: "CHECKING_AUTH",
  AUTHORIZED: "AUTHORIZED",
  AUTHORIZING: "AUTHORIZING",
  NOT_AUTHORIZED: "NOT_AUTHORIZED",
} as const;
export type AuthStateType = typeof AuthStates[keyof typeof AuthStates];

export class AuthStore {
  rootStore: Store;
  state: AuthStateType = AuthStates.CHECKING_AUTH;
  tg_user_ID: Optional<number> = null;

  constructor(rootStore: Store) {
    this.rootStore = rootStore; 
    makeAutoObservable(this) 
  }

  
  get isCheckingAuth() {
    return this.state === AuthStates.CHECKING_AUTH;
  }

  get isAuth() {
    return this.state === AuthStates.AUTHORIZED;
  }

  get isAuthorized() {
    return this.state === AuthStates.AUTHORIZED;
  }
  get isFailed() {
    return this.state === AuthStates.NOT_AUTHORIZED;
  }

  get isAuthorizing() {
    return this.state === AuthStates.AUTHORIZING;
  }

  setState(state: AuthStateType) {
    this.state = state;
  }

  /** тут мы авторизуемся */
  async authorize() {
    this.setState('AUTHORIZING')
    const { userId } = useTelegram();
    if(!userId) {
      logger.log("Мы в браузере", "auth-store")
      logger.log("Мы не авторизованы", "auth-store")
      this.setCurrentStage('input_tel_number')
      this.setState('NOT_AUTHORIZED')
    } else {
      logger.log("Мы в телеграме", "auth-store")
      logger.log("Делаем первый loadUserInfo с точкой 0 и userId " + userId, "auth-store")
      await this.rootStore.userStore.loadUserInfo(0, userId)
    }
  }

  checkCode = ''
  setCheckCode(code: string) {
    this.checkCode = code
  }
  clientState: Optional<clientStateType> = null
  setClientState(state: clientStateType) {
    this.clientState = state
  }

  phoneNumber = ''
  setPhoneNumber(phone: string) {
    this.phoneNumber = phone
  }

  /**
   * checkUserPhone - первый запрос
   * принимает всё те же userId и phone, 
   * т.е. данные по пользователю тг и его номер телефона, 
   * @param phone 
   * @param userId 
   */
  login = async (phone: string) => {
    logger.log("Ввели следующий номер " + phone, "Auth-Store: login()")
    const { userId } = useTelegram()
    if(!userId) {
      this.onlyTelegramAlert()
      return;
    }
    this.setCurrentStage('verify_number')
    /**
     * может вернуть 3 варианта: 
     *    no_client - значит надо что бы человек сделал start в боте
     *    old_user - значит пользователь уже был, 
     * мы выслали код смс на его номер, что бы подтвердить что он это он
     *    new_user - номер в базе не найден, 
     * будем заводить карту, так же отправили смс
     */
    this.setPhoneNumber(phone)
    logger.log("call /checkUserPhone with " + phone + " & userId " + userId, "Auth-Store: login()")
    const result = await http.post<any, clientStateType>(
      '/checkUserPhone', 
      { phone, userId }
    )
    logger.log("result: " + result, "POST /checkUserPhone")
    switch (result) {
      case 'no_client':
        this.setClientState(result)
        logger.error('прилетел NO_CLIENT', "auth-store")
        Dialog.alert({
          header: (<ExclamationCircleFill style={{ fontSize: 64, color: 'var(--adm-color-warning)' }}/>),
          title: 'Обратитесь к администратору',
          content: <>
            <p>Произошла ошибка при проверке номера телефона</p>
            <pre style={{
              background: "var(--adm-color-danger)",
              color: 'white',
              padding: 10, marginBottom: 15, marginTop: 15
            }}>
              Status: - no_client
            </pre>
          </>,
          confirmText: 'Хорошо',
          onConfirm() {
            const tg = useTelegram()
            if(tg.isInTelegram()) {
              tg.tg.openTelegramLink('https://t.me/Elipeli_operator');
            } else {
              window.open('https://t.me/Elipeli_operator'); 
            }
          },
        })
        break;
      /**
       * ну и regNewUser, если был статус new_user
       * там есть поля имя, пол, др
       * мол может быть только два варианта муж и жен
       * др только в таком формате, т.е. ггггммдд
       * ну и код из смс
       * вернёт опять таки статус, если complite, то всё ок
       */
      case 'new_user':
        logger.log('прилетел Status new_user', "auth-store")
        this.setCurrentStage('input_sms_code')
        this.setClientState(result)
        break;
      /**
       * если был статус old_user, 
       * то выводим окно ввода кода из смс и выполняем regOldUser, 
       * там всё те же userid и телефон, 
       * но добавляется random_code, 
       * это как раз код из смс сообщения, 
       * вернёт Status, если complite, то всё ок
       */
      case 'old_user':
        logger.log('прилетел Status old_user', "auth-store")
        this.setCurrentStage('input_sms_code')
        this.setClientState(result)
        break;
    }
  }

  inputSmsCode = async (code: string) => {
    const { userId } = useTelegram()
    if(!userId) {
      this.onlyTelegramAlert()
      return;
    }
    this.setCheckCode(code)
    if(this.clientState === 'new_user') {
      this.setCurrentStage('fill_form')
    } else if(this.clientState === 'old_user') {
      const result = await http.post<any, any>(
        '/regOldUser', 
        { userId, phone: this.phoneNumber, random_code: code }
      )
      if(result?.Status === 'complite') {
        this.setState('AUTHORIZED')
        this.setCurrentStage('authorized_successfully')
        Dialog.alert({
          header: (<GiftOutline style={{ fontSize: 64, color: 'var(--adm-color-success)' }}/>),
          title: 'Вы зарегестрированы',
          content: <p>{result?.Message}</p>,
          confirmText: 'Отлично',
        })
        const COrg = this.rootStore.userStore.currentOrg
        this.rootStore.auth.authorize()
        this.rootStore.userStore.loadUserInfo(COrg, userId)
      } else {
        Dialog.alert({
          header: (<ExclamationCircleFill style={{ fontSize: 64, color: 'var(--adm-color-warning)' }}/>),
          title: 'Не удалось зарегестрироваться',
          confirmText: 'Понятно',
        })
        this.setCurrentStage('input_tel_number') 
        throw new Error("Не удалось зарегестрироваться")
      }
    }
  }

  /**
   * предупредить что приложение онлив телеге 
   * и закрыть
   */
  onlyTelegramAlert() {
    Dialog.alert({
      header: (<ExclamationCircleFill style={{ fontSize: 64, color: 'var(--adm-color-warning)' }}/>),
      title: 'Не работает в браузере',
      content: 'Приложение разработано для использвания в телеграм боте',
      confirmText: 'Понятно',
    })
  } 




  registration = async (data: SignInPayload) => {
    const { userId } = useTelegram()
    if(!userId) {
      this.onlyTelegramAlert()
      return;
    }
    const result = await http.post<any, any>(
      '/regNewUser', 
      {
        userId, 
        regname: data.name, 
        gender: data.gender, 
        birthday: data.birthday, 
        random_code: this.checkCode
      }
    ).catch(console.error)
    console.log(result)
    if(result?.Status === 'complite') {
      this.setState('AUTHORIZED')
      this.setCurrentStage('authorized_successfully')
      Dialog.alert({
        header: (<GiftOutline style={{ fontSize: 64, color: 'var(--adm-color-success)' }}/>),
        title: 'Вы зарегестрированы',
        content: <p>{result?.Message}</p>,
        confirmText: 'Отлично',
      })
      const COrg = this.rootStore.userStore.currentOrg
      this.rootStore.auth.authorize()
      this.rootStore.userStore.loadUserInfo(COrg, userId)
    } else {
      Dialog.alert({
        header: (<ExclamationCircleFill style={{ fontSize: 64, color: 'var(--adm-color-warning)' }}/>),
        title: 'Не удалось зарегестрироваться',
        confirmText: 'Понятно',
      })
      this.setCurrentStage('input_tel_number') 
      throw new Error("Не удалось зарегестрироваться")
    }
  }

  currentStage: RegistrationStageType | LoginStageType = 'input_tel_number'
  setCurrentStage(stage: RegistrationStageType | LoginStageType) {
    this.currentStage = stage
  }
  loginSchemaTree: loginStage = {
    process: "input_tel_number",
    then: {
      process: "verify_number",
      then: [
        {
          process: "registration",
          then: {
            process: "input_sms_code",
            then: {
              process: "fill_form", 
              then: { 
                process: "login", 
                then: {
                  process: "authorized_successfully", 
                  then: []
                } 
              }
            }
          }
        }, 
        {
          process: "login",
          then: {
            process: "authorized_successfully",
            then: []
          }
        }
      ]
    }
  }
}

export const LoginStages = {
  input_tel_number: "input_tel_number", 
  verify_number: "verify_number", 
  registration: "registration", 
  login: "login", 
  authorized_successfully: "authorized_successfully"
} as const
export type LoginStageType = 
  typeof LoginStages[keyof typeof LoginStages];

export const RegistrationStages = {
  input_sms_code: "input_sms_code", 
  fill_form: "fill_form", 
} as const
export type RegistrationStageType = 
  typeof RegistrationStages[keyof typeof RegistrationStages];

export type loginStage = {
  process: RegistrationStageType | LoginStageType
  then: loginStage | Array<loginStage>
}

export type SignInPayload = {
  name: string,
  birthday: string,
  gender: string
}

type clientStateType = 'no_client' | 'old_user' | 'new_user'