import React from "react";
import { makeAutoObservable, reaction } from "mobx";
import { AuthStore, CartStore, MainPageStore } from "./stores";
import { UserInfoStore } from "./stores/UserInfoStore";
import { getItem, logger } from "../common/features";
import { ActionsPageStore } from "./stores/ActionsStore";
import { useTelegram } from "../common/hooks";
import * as uuid from 'uuid';

export class Store {
  /**
   * просто рандом который генерируется при каждом входе
   * в приложение, чтобы картинки кэшировались только 
   * в рамках одной сессии приложения 
   */
  session = uuid.v4()
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
    const disposeToAuth = reaction(
      () => this.auth.isAuthorized,
      (value, prevValue) => {
        // действия выполнятся только если мы авторизовались
        if (value === true && prevValue === false) {
          logger.log("Сработала подписка на авторизацию", "Root-store: dispose to auth")
          const { userId } = useTelegram()
          this.userStore.loadOrdersHistory(userId)
        }
      }
    );

    /** подписка при не прошедшей авторизации */
    const disposeToFailedAuth = reaction(
      () => this.auth.isFailed,
      (val, prev) => {
        if(val === true && prev === false) {
          logger.log(
            "Сработала подписка failed авторизацию", 
            "Root-store: dispose to failed auth"
          )
          const first = this.userStore.organizations[0]
          if(first) {
            logger.log(
              "Обновляем userStore.currentOrg на " + first.Id, 
              "Root-store: dispose to failed auth"
            )
            this.userStore.currentOrg = first.Id
            const { userId } = useTelegram()
            if(userId) {
              logger.log(
                "Грузим инфу о пользователе " + userId +
                ", с точкой " + first.Id, 
                "Root-store: dispose to failed auth"
              )
              this.userStore.loadUserInfo(first.Id, userId)
            } else {
              logger.log(
                "Грузим только скидки т к нет userId, подставили 0", 
                "Root-store: dispose to failed auth"
              )
              this.userStore.loadUserInfo(first.Id, "0")
            }
          } else {
            logger.log("Список организаций пустой!!!", "root-store")
          }
        }
      }
    )
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
        if(prevValue !== value) {
          const { isInTelegram, userId } = useTelegram()
          logger.log(`Org_id изменился c ${prevValue} на ${value} - загружаем других поваров, меню `, 'root-Store')
          this.mainPage.loadCooks(value);
          this.mainPage.loadMenu(value);   
          if(this.auth.tg_user_ID) {
            this.userStore.loadUserInfo(value, this.auth.tg_user_ID);
            logger.log("Org_id изменился - обновляем инфу об акциях loadUserInfo", 'rootStore')
            logger.log('this.auth.tg_user_ID = ' + this.auth.tg_user_ID, 'rootStore')
          } else {
            logger.log('this.auth.tg_user_ID не существует', 'rootStore')
            logger.log('    но все равно надо обновить акции (loadUserInfo)', 'rootStore')
            if(isInTelegram()) {
              logger.log('    - calling loadUserInfo with tg userId', 'rootStore')
              this.userStore.loadUserInfo(value, userId)
            } else {
              logger.log('    - calling loadUserInfo with 0', 'rootStore')
              this.userStore.loadUserInfo(value, 0)
            }
          }
        }
      }
    )
    
    this.subscriptions.push(disposeToAuth);
    this.subscriptions.push(disposeToFailedAuth);
    this.subscriptions.push(whenAllReady);
    this.subscriptions.push(whenUsersOrgHasBeenSaved);
    this.afterLoaded()
  }

  // Загружаются общие данные, главные страницы и т.д.
  async afterLoaded() {
    logger.log('страница загружена', "root-store: afterLoaded")
    await this.userStore.loadOrganizations();
    logger.log('организации загружены', "root-store: afterLoaded")
    await this.auth.authorize();
  }

  onDestroy() {
    for (const unsubscribe of this.subscriptions) {
      unsubscribe();
    }
  }
}
const empty = null as unknown as Store
export const StoreContext = React.createContext<Store>(empty);