import { makeAutoObservable } from "mobx";
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

  get isAuthorizing() {
    return this.state === AuthStates.AUTHORIZING;
  }

  setState(state: AuthStateType) {
    this.state = state;
  }

  /** todo auth */
  getCurrentUser() {
    this.setState('AUTHORIZING')
    const { userId } = useTelegram();
    if(!userId) {
      this.setState('NOT_AUTHORIZED')
    } else {
      this.setState('AUTHORIZED')
      this.tg_user_ID = userId
    }
  }
}