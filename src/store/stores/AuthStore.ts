import { makeAutoObservable } from "mobx";
import { logger } from "../../common/features";
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
      this.setState('NOT_AUTHORIZED')
    } else {
      logger.log("Мы в телеграме", "auth-store")
      const UserInfo = await this.rootStore.userStore.loadUserInfo(0, userId)
      if(UserInfo) {
        this.setState('AUTHORIZED')
        logger.log("Мы авторизованы", "auth-store")
        this.tg_user_ID = userId
      } else {
        logger.log("Мы не авторизованы", "auth-store")
        this.setState('NOT_AUTHORIZED')
      }
    }
  }
}