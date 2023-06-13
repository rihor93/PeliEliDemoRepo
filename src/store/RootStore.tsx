import React from "react";
import { makeAutoObservable, reaction } from "mobx";
import { AuthStore, CartStore, MainPageStore } from "./stores";

export class Store {
  auth = new AuthStore(this); // todo auth
  mainPage = new MainPageStore(this);
  cartStore = new CartStore(this);

  subscriptions: (() => void)[] = [];

  constructor() { 
    makeAutoObservable(this);
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
    console.log('after authorized')
  }

  // Загружаются общие данные, главные страницы и т.д.
  afterLoaded() {
    console.log('after loaded')
    this.mainPage.loadMenu()
  }

  onDestroy() {
    for (const unsubscribe of this.subscriptions) {
      unsubscribe();
    }
  }
}
const empty = null as unknown as Store
export const StoreContext = React.createContext<Store>(empty);