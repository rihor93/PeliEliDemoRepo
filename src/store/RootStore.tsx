import React from "react";
import { makeAutoObservable, reaction } from "mobx";
import { AuthStore, CartStore, MainPageStore } from "./stores";
import { UserInfoStore } from "./stores/UserInfoStore";
import { logger } from "../common/features";

export class Store {
  auth = new AuthStore(this); // todo auth
  mainPage = new MainPageStore(this);
  cartStore = new CartStore(this);
  userStore = new UserInfoStore(this);

  subscriptions: (() => void)[] = [];

  constructor() { 
    makeAutoObservable(this);
    /** подписка на авторизацию  */
    const dispose = reaction(
      () => this.auth.isAuthorized,
      (value, prevValue) => {
        if (value === true && prevValue === false) {
          this.afterAuthorized()
        }
      }
    );
    
    this.subscriptions.push(dispose);
    this.afterLoaded()
  }
  // Загружаются данные связаные с учеткой
  afterAuthorized() {
    logger.log('мы авторизовались', Store.name);
    //this.userStore.loadUserInfo() stoped here
  }

  // Загружаются общие данные, главные страницы и т.д.
  afterLoaded() {
    logger.log('страница загружена', Store.name)
    this.mainPage.loadMenu();
    this.userStore.loadOrganizations();
    this.auth.getCurrentUser();
  }

  onDestroy() {
    for (const unsubscribe of this.subscriptions) {
      unsubscribe();
    }
  }
}
const empty = null as unknown as Store
export const StoreContext = React.createContext<Store>(empty);