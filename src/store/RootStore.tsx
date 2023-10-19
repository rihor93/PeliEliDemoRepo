import React from "react";
import { makeAutoObservable, reaction } from "mobx";
import { AuthStore, CartStore, MainPageStore } from "./stores";
import { UserInfoStore } from "./stores/UserInfoStore";
import { getItem, logger } from "../common/features";
import { ActionsPageStore } from "./stores/ActionsStore";
import { useTelegram } from "../common/hooks";

export class Store {
  /** видна ли поисковая строка в навбаре */
  searchInputVisible = false
  /** показываем или скрываем поисковую строку */
  setSearchInputVisible(val: boolean) {
    this.searchInputVisible = val;
  }

  auth = new AuthStore(this); // todo auth
  mainPage = new MainPageStore(this);
  cartStore = new CartStore(this);
  userStore = new UserInfoStore(this);
  actionsPage = new ActionsPageStore(this)

  subscriptions: (() => void)[] = [];

  constructor() { 
    makeAutoObservable(this);
    /** подписка на авторизацию  */
    const dispose = reaction(
      () => this.auth.isAuthorized,
      (value, prevValue) => {
        if (value === true && prevValue === false) {
          this.afterAuthorized()
          this.userStore.loadUserInfo(0)
        }
      }
    );
    /**
     * Когда все загрузится можем
     * зайти в localstorage
     * и взять сохраненную корзину
     */
    const whenAllReady = reaction(
      () => [this.mainPage.state, this.mainPage.cookstate, this.userStore.orgstate, this.userStore.userLoad],
      (vals, prevVals) => {
        if(!vals.map(val => val === 'COMPLETED').includes(false)) {
          // вспоминаем что сохранили в локал стораге
          const savedCart = getItem<CouseInCart[]>('cartItems')
          // надо проверить есть ли сейчас это блюдо в меню
          if(savedCart?.length) {
            this.cartStore.items = [];
            savedCart.forEach((couseInCart) => {
              const isExistsOnMenu = this.mainPage.allDishes.find((bludo) => 
                bludo.VCode === couseInCart.couse.VCode
              )
              // если есть то норм
              if(isExistsOnMenu) for (let i = 1; i <= couseInCart.quantity; i++) {
                this.cartStore.addCourseToCart(isExistsOnMenu)                
              }
            })
          }
        }
      }
    )

    /** подписка на изменения org id */
    const whenUsersOrgHasBeenSaved = reaction(
      () => this.userStore.currentOrg,
      (value, prevValue) => {
        logger.log('Org_id изменился - загружаем другие скидки loadUserInfo', 'rootStore')
        if(prevValue !== value) {
          this.mainPage.loadCooks(value);
          this.mainPage.loadMenu(value);
          this.userStore.loadUserInfo(value);
        }
      }
    )
    
    this.subscriptions.push(dispose);
    this.subscriptions.push(whenAllReady);
    this.subscriptions.push(whenUsersOrgHasBeenSaved);
    this.afterLoaded()
  }
  // Загружаются данные связаные с учеткой
  afterAuthorized() {
    const { userId } = useTelegram()
    this.userStore.loadOrdersHistory(userId)
    logger.log('мы авторизовались', "root-store");
  }

  // Загружаются общие данные, главные страницы и т.д.
  afterLoaded() {
    logger.log('страница загружена', "root-store")
    this.userStore.loadOrganizations();
    this.auth.authorize();
  }

  onDestroy() {
    for (const unsubscribe of this.subscriptions) {
      unsubscribe();
    }
  }
}
const empty = null as unknown as Store
export const StoreContext = React.createContext<Store>(empty);