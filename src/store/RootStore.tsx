import React from "react";
import { makeAutoObservable, reaction, toJS } from "mobx";
import { AuthStore, CartStore, MainPageStore, Modal } from "./stores";
import { UserInfoStore } from "./stores/UserInfoStore";
import { getItem, http, logger } from "../common/features";
import { ActionsPageStore } from "./stores/ActionsStore";
import { useTelegram } from "../common/hooks";
import * as uuid from 'uuid';
import { LoadStatesType, Optional } from "../common/types";
import { Toast } from "antd-mobile";

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
  iPhone15Lottery = new iPhone15Lottery(this)

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
              logger.log('    - calling loadUserInfo with tg userId' + userId + " & orgId " + value, 'rootStore')
              this.userStore.loadUserInfo(value, userId)
            } else {
              logger.log('    - calling loadUserInfo with 0 & orgId ' + value, 'rootStore')
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



class iPhone15Lottery {
  /**
   * попап просмотра формы розыгрышка
   */
  watchLotteryPopup = new Modal()

  /**
   * страница просмотра условий розыгрышка
   */
  lotteryDescriptiomPage = new Modal()



  state: LoadStatesType = 'INITIAL'
  setState = (state: LoadStatesType) => {
    this.state = state
  }

  /**
   * номер участника в лотерее
   *    null - initial state
   *    >0 - значит пользователь учавствует и это его номер
   *    -1 или <0 - пользователь не учавствует 
   */
  engageNumber: Optional<number> = null
  setEngageNumber(number: number) {
    this.engageNumber = number
  }

  /**
   * учавствует ли пользователь в розыгрыше
   *    null - initial state
   *    true - yes
   *    false - no
   */
  IsEngageInLottery: Optional<boolean> = null
  setIsEngageInLottery = (value: boolean) => {
    this.IsEngageInLottery = value
  }

  constructor(readonly rootStore: Store) {
    makeAutoObservable(this)
    this.getIsEngage()
    this.points = JSON.parse(localStorage.getItem('iPhone15lottery_2') 
    ?? '{"1":false,"2":false,"3":false,"4":false}')
  }

  getIsEngage() {
    const { userId } = useTelegram()
    this.setState('LOADING')
    if(userId) {
      http.post("/GetUserCode", { userId }).then((result: any) => {
        if(Number(result?.Number ?? 0) > 0) {
          this.setEngageNumber(Number(result.Number))
          this.setIsEngageInLottery(true)
        } else {
          this.setEngageNumber(-1)
          this.setIsEngageInLottery(false)
        }
        this.setState('COMPLETED')
      })
      .catch(this.onError)
    } else {
      this.onError()
    }
  }

  onError = () => {
    Toast.show({ 
      content: 'Не удалось загрузить сведения об участии', 
      position: 'center'
    })
  }

  setPointComleted = (key: number, val: boolean) => {
    //@ts-ignore
    this.points[key] = val
    localStorage.setItem('iPhone15lottery', JSON.stringify(toJS(this.points)))
  }
  /**
   * выполнены ли пункты для розыгрыша
   */
  points = {
    1: false,
    2: false,
    3: false,
    4: false
  }
}