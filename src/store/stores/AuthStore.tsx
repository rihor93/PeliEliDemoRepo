import { InfoOutlined } from "@ant-design/icons";
import { Dialog, Image } from "antd-mobile";
import { ExclamationCircleFill, GiftOutline } from "antd-mobile-icons";
import { makeAutoObservable } from "mobx";
import { Pizza } from "../../assets";
import { http, logger } from "../../common/features";
import { useTelegram } from "../../common/hooks";
import { Optional } from "../../common/types";
import { Store } from "../RootStore";
import Metrics from "./Metriks";

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

  /** тут мы проверяем авторизацию */
  async check() {
    this.setState('CHECKING_AUTH')
    const orgId = this.rootStore.userStore.currentOrg
    switch (this.rootStore.instance) {
      case 'TG_BROWSER': {
        const { userId: tgId } = useTelegram() // eslint-disable-line
        const result = tgId
          ? await this.rootStore.userStore.loadUserInfo(orgId, tgId)
          : await this.rootStore.userStore.loadUserInfo(orgId, 0)

        result?.UserInfo
          ? this.setState('AUTHORIZED')
          : this.setState('NOT_AUTHORIZED')

        if (tgId) this.rootStore.userStore.setID(tgId)
        break;
      }
      case 'WEB_BROWSER':
        const webId = localStorage.getItem('webId')
        const result = webId
          ? await this.rootStore.userStore.loadUserInfo(orgId, webId)
          : await this.rootStore.userStore.loadUserInfo(orgId, 0)

        result?.UserInfo
          ? this.setState('AUTHORIZED')
          : this.setState('NOT_AUTHORIZED')

        if (webId) this.rootStore.userStore.setID(webId)
        break;
    }
    logger.log(this.state, 'auth-store')
  }

  authorize = async (phone: string) => {
    try {
      let state: resultType

      switch (this.rootStore.instance) {
        case 'TG_BROWSER': {
          const { userId } = useTelegram()
          const result = await http.post<any, resultType>(
            '/checkUserPhone',
            { phone, userId }
          )
          if (result?.length) state = result
          break
        }
        case 'WEB_BROWSER': {
          const result = await http.post<any, resultType2>(
            '/checkUserPhoneWeb',
            { phone } // todo UTM
          )
          if (result.State && result.UserId) {
            localStorage.setItem('webId', result.UserId)
            this.rootStore.userStore.setID(result.UserId)
            state = result.State
          }
          break
        }
      }
      //@ts-ignore
      if(state && state !== 'no_client') {
        this.setStage('INPUT_SMS_CODE')
        this.setClientState(state)
        this.setPhoneNumber(phone)
      }
      
    } catch (err) {
      logger.error(err)
      this.setState('NOT_AUTHORIZED')
      this.setStage('INPUT_TELEPHONE')
    }
  }

  clientState: resultType | null = null
  setClientState(s: resultType) { this.clientState = s }

  
  stage: AuthStage = 'INPUT_TELEPHONE'
  setStage(stage: AuthStage) {
    this.stage = stage
  }
  checkCode = ''
  setCheckCode(code: string) {
    this.checkCode = code
  }

  phoneNumber = ''
  setPhoneNumber(phone: string) {
    this.phoneNumber = phone
  }


  inputSmsCode = async (code: string) => {
    this.setCheckCode(code)
    if(this.clientState === 'new_user') {
      this.setStage('REGISTRATION')
    } else if(this.clientState === 'old_user') {
      const userId = this.rootStore.userStore.ID
      const result = await http.post<any, any>(
        '/regOldUser', 
        { userId, phone: this.phoneNumber, random_code: code }
      )
      if(result?.Status === 'complite') {
        this.setState('AUTHORIZED')
        this.setStage('COMPLETED')
        Dialog.alert({
          header: (<Image 
            src={Pizza}
            width='300px'
            height='auto'
          />),
          title: 'Ну, наконец-то, познакомились!',
          content: <p>{result?.Message}</p>,
          confirmText: 'Отлично!',
        })
        const COrg = this.rootStore.userStore.currentOrg
        this.rootStore.userStore.loadUserInfo(COrg, userId)
        Metrics.registration()
      } else {
        Dialog.alert({
          header: (<ExclamationCircleFill style={{ fontSize: 64, color: 'var(--adm-color-warning)' }}/>),
          title: 'Не удалось зарегестрироваться',
          confirmText: 'Понятно',
        })
        this.setStage('INPUT_TELEPHONE') 
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
    const userId = this.rootStore.userStore.ID
    const result = await http.post<any, any>(
      '/regNewUser', 
      {
        userId, 
        regname: data.name, 
        birthday: data.birthday, 
        random_code: this.checkCode
      }
    ).catch(console.error)
    if(result?.Status === 'complite') {
      this.setState('AUTHORIZED')
      this.setStage('COMPLETED')
      Dialog.alert({
        header: (<Image 
          src={Pizza}
          width='300px'
          height='auto'
        />),
        title: 'Ну, наконец-то, познакомились!',
        content: <p>{result?.Message}</p>,
        confirmText: 'Отлично!',
      })
      const COrg = this.rootStore.userStore.currentOrg
      this.rootStore.userStore.loadUserInfo(COrg, userId)
      Metrics.registration()
    } else {
      Dialog.alert({
        header: (<ExclamationCircleFill style={{ fontSize: 64, color: 'var(--adm-color-warning)' }}/>),
        title: 'Не удалось зарегестрироваться',
        confirmText: 'Понятно',
      })
      this.setStage('INPUT_TELEPHONE')
      throw new Error("Не удалось зарегестрироваться")
    }
  }
}

export type SignInPayload = {
  name: string,
  birthday: string
}


type resultType = 'no_client' | 'old_user' | 'new_user'
type resultType2 = {
  State: resultType
  UserId: string
}


export const AuthStages = {
  /** 1) первая по счету - ввод номера */
  INPUT_TELEPHONE: "INPUT_TELEPHONE",
  /** 2) после ввода номера прилетит код */
  INPUT_SMS_CODE: "INPUT_SMS_CODE",
  /** 3) если пользователь не зареган то должен пройти рег-цию */
  REGISTRATION: "REGISTRATION",
  /** 3 или 4) если пользователь зареган, то он успешно зайдет */
  COMPLETED: "COMPLETED",
} as const;
export type AuthStage = typeof AuthStages[keyof typeof AuthStages];