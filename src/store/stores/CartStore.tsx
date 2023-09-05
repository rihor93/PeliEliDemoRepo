import { Toast } from "antd-mobile";
import { ToastHandler } from "antd-mobile/es/components/toast";
import { flow, makeAutoObservable } from "mobx";
import { http, logger, setItem } from "../../common/features";
import { LoadStatesType, Undef } from "../../common/types";
import { Store } from "../RootStore";
import { Modal } from "./MainPageStore";

export const receptionTypes = {
  pickup: 'pickup',
  delivery: 'delivery'
} as const;
export type ReceptionType = typeof receptionTypes[keyof typeof receptionTypes];


export class CartStore { 
  /** состояние запросов */
  state: LoadStatesType = 'INITIAL';
  get isLoading() { return this.state === 'LOADING' }
  get isDone() { return this.state === 'COMPLETED' }
  get isFailed() { return this.state === 'FAILED' }

  onStart() { 
    this.state = 'LOADING' 
  }
  onSuccess(text?: string) {
    if(text?.length) {
      Toast.show({
        icon: 'success',
        content: text,
        position: 'center',
      })
    }
    this.state = 'COMPLETED'
  }
  onFailure(errStr: string) {
    if(errStr.length) {
      Toast.show({ 
        icon: 'fail', 
        content: errStr,
        position: 'center',
      })
    }
    this.state = 'FAILED'
  }

  receptionType: ReceptionType = 'pickup';
  setReceptionType(receptionType: ReceptionType) {
    this.receptionType = receptionType
  }

  rootStore: Store
  constructor(rootStore: Store) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  
  confirmOrderModal = new Modal();

  items: Array<CouseInCart> = [];
  totalPrice = 0;

  get isEmpty() {
    return !this.items.length
  }

  findItem(vcode: number) {
    return this.items.find((item) => item.couse.VCode == vcode)
  }

  addCourseToCart(couse: CourseItem) {
    let { totalPrice, items, isEmpty } = this;
    const userInfo = this.rootStore.userStore.userState;
    let isCourseAdded: Undef<CouseInCart>;

    isCourseAdded = this.findItem(couse.VCode);

    if (isCourseAdded) {
      // если блюдо уже есть 
      // добавляем его
      isCourseAdded.quantity++;

      // оставляем его, но
      // в большем количестве
      items = items.map((item) =>
        item.couse.VCode == couse.VCode
          ? isCourseAdded as CouseInCart
          : item
      )
      this.applyDiscount(
        { totalPrice, items, isEmpty },
        userInfo.percentDiscounts,
        userInfo.dishDiscounts,
        userInfo.allCampaign,
        userInfo.dishSet,
      )
    } else {
      // если блюда нет
      // добавляем его
      const newItemInCart: CouseInCart = {
        couse, 
        quantity: 1, 
        priceWithDiscount: couse.Price
      }

      items = [...items, newItemInCart]
      this.applyDiscount(
        { totalPrice, items, isEmpty },
        userInfo.percentDiscounts,
        userInfo.dishDiscounts,
        userInfo.allCampaign,
        userInfo.dishSet,
      )
    }
  }

  removeFromCart(VCode: number) {
    let { totalPrice, items, isEmpty } = this;
    const userInfo = this.rootStore.userStore.userState;

    let isCourseAdded: Undef<CouseInCart>;

    isCourseAdded = this.findItem(VCode);

    if (isCourseAdded) {
      if (isCourseAdded?.quantity > 1) {
        // если блюд больше чем 1
        // убавляем его
        isCourseAdded.quantity--;

        // оставляем это блюдо
        // но в меньшем количестве
        items = items.map((item) =>
          item.couse.VCode == VCode
            ? isCourseAdded as CouseInCart
            : item
        )


        this.applyDiscount(
          { totalPrice, items, isEmpty },
          userInfo.percentDiscounts,
          userInfo.dishDiscounts,
          userInfo.allCampaign,
          userInfo.dishSet,
        )
      } else {
        // если блюдо 1
        // то убираем его
        items = items.filter((item) =>
          item.couse.VCode !== VCode
        )
        this.applyDiscount(
          { totalPrice, items, isEmpty },
          userInfo.percentDiscounts,
          userInfo.dishDiscounts,
          userInfo.allCampaign,
          userInfo.dishSet,
        )
      }
    }
  }

  /** пересчитать скидку */
  private applyDiscount(
    state: Pick<CartStore, 'items' | 'isEmpty' | 'totalPrice'>,
    percentDiscounts: PercentDiscount[],
    dishDiscounts: DishDiscount[],
    allCampaign: AllCampaignUser[],
    dishSet: DishSetDiscount[],
  ) {
    let promo = null;//пока заглушка, т.к. нет промо
    let new_state = { ...state }//копируем текущий стейт, для его изменения


    if (true) {
      let dishSets = dishSet;
      let dishsDiscounts = dishDiscounts;
      //массив сетов, из которых мы нашли данные
      let curDishSets: DishSetDiscountActive[] = [];
      //проверим все скидки, найдем наибольшую
      let maxPercentDiscount: PercentDiscount = { vcode: 0, MinSum: 0, MaxSum: 0, bonusRate: 0, discountPercent: 0 };
      percentDiscounts?.forEach(a => {
        if (maxPercentDiscount.vcode == 0) {
          maxPercentDiscount = a;
        } else if (maxPercentDiscount.discountPercent < a.discountPercent) {
          maxPercentDiscount = a;
        }
      })
      //идём по всем блюдам в корзине
      for (let i = 0; i < new_state.items.length; i++) {

        let courseItem = new_state.items[i];
        //если есть процентная скидка, сразу её ставим
        if (maxPercentDiscount !== null) {
          courseItem.campaign = maxPercentDiscount.vcode;
          courseItem.priceWithDiscount = courseItem.couse.Price * courseItem.quantity * (100 - maxPercentDiscount.discountPercent) / 100;
        } else {
          courseItem.priceWithDiscount = courseItem.couse.Price * courseItem.quantity;
        }
        //идём по всем сэтам и смотрим, сколько у нас наберётся элементов в сэте
        for (let j = 0; j < dishSets.length; j++) {
          let set = dishSets[j];
          //идём по всем блюдам сэта
          for (let k = 0; k < set.dishes.length; k++) {
            //если нашли блюдо из сэта, то увеличиваем счётчик сэта
            if (courseItem.couse.VCode == set.dishes[k].dish) {
              let curDishSetObj = curDishSets.find(a => a.vcode == set.vcode);
              if (curDishSetObj === undefined) {
                curDishSetObj = { ...set, countInCart: 0 };
                curDishSets.push(curDishSetObj);
              }
              curDishSetObj.countInCart += courseItem.quantity;

            }
          }
        }

        //идём по всем скидкам на позиции, смотрим что выгоднее, цена по акции или по общей скидки в процентах
        for (let j = 0; j < dishsDiscounts.length; j++) {
          let dishDiscount = dishsDiscounts[j];
          //нашли блюдо в акции
          if (courseItem.couse.VCode == dishDiscount.dish && dishDiscount.promocode == promo) {
            //если есть процентная скидка
            if (courseItem.quantity * dishDiscount.price < courseItem.priceWithDiscount) {
              courseItem.campaign = dishDiscount.vcode;
              // я не понимаю как оно работает 
              // но тут надо сделать так
              // если есть установленный прайс
              if(dishDiscount.price){ 
                courseItem.priceWithDiscount = courseItem.quantity * dishDiscount.price;
              }
              // если нет прайса но есть скидочный процент
              // @ts-ignore
              if(dishDiscount.discountPercent) {
                // @ts-ignore
                courseItem.priceWithDiscount = (courseItem.couse.Price - (courseItem.couse.Price * dishDiscount.discountPercent / 100)) * courseItem.quantity;
              }
            }
          }
        }

      }

      for (let j = 0; j < curDishSets.length; j++) {
        if (curDishSets[j].countInCart == curDishSets[j].dishCount && curDishSets[j].dishes[0].promocode == promo) {
          for (let i = 0; i < new_state.items.length; i++) {
            let courseItem = new_state.items[i];
            let dishInSet = curDishSets[j].dishes.find(a => a.dish == courseItem.couse.VCode);
            if (dishInSet !== undefined) {
              courseItem.campaign = curDishSets[j].vcode;
              // если есть установленный прайс
              if(dishInSet.price){ 
                courseItem.priceWithDiscount = courseItem.quantity * dishInSet.price;
              }
              // если нет прайса но есть скидочный процент
              // @ts-ignore
              if(dishInSet.discountPercent) {
                // @ts-ignore
                courseItem.priceWithDiscount = courseItem.quantity * (courseItem.couse.Price - (courseItem.couse.Price * dishInSet.discountPercent / 100));
              }
            }
          }
        }
      }
    }

    //new_state.itemsInCart.forEach(a => { a.priceWithDiscount = a.couse.Price * a.quantity; });


    this.items = new_state.items
    this.totalPrice = new_state.items.reduce((acc, cur) => 
      acc + cur.priceWithDiscount, 0
    )

    
    // корзину запоминаем 
    // только когда все загрузилось,
    // иначе запомним пустой массив 
    const { state: load, cookstate } = this.rootStore.mainPage;
    if(load === 'COMPLETED' && cookstate === 'COMPLETED') setItem('cartItems', state.items)
  }

  applyDiscountForCart(userInfo: UserInfoState) {
    const { totalPrice, items, isEmpty } = this;

    this.applyDiscount(
      { totalPrice, items, isEmpty },
      userInfo.percentDiscounts,
      userInfo.dishDiscounts,
      userInfo.allCampaign,
      userInfo.dishSet,
    )
  }

  watchdetailModal = new Modal()

  postOrder = flow(function* (
    this: CartStore,
    order: Order, 
    handler: React.MutableRefObject<ToastHandler | undefined>
  ) {
    try {
      this.onStart()
      handler.current = Toast.show({
        icon: 'loading',
        content: 'Загрузка',
        position: 'center', 
        duration: 0
      })
      const response: Order = yield http.post('/NewOrder', order);
      logger.log('Делаем запрос оформить заказ', 'cart-store')
      if(response) {
        logger.log('Заказ успешно оформлен', 'cart-store')
        handler.current?.close()
        this.onSuccess('Заказ успешно оформлен')
        this.items = [];
        this.totalPrice = 0;
      };
    } catch (e) { 
      logger.log('Заказ блин не оформился', 'cart-store')
      this.onFailure('Не удалось оформить заказ')
    }
  })

  deliveryOptions = [
    {
      label: 'Самовывоз',
      value: receptionTypes.pickup as ReceptionType,
    },
    {
      disabled: true,
      label: 'Доставка',
      value: receptionTypes.delivery as ReceptionType,
    }
  ]
}

