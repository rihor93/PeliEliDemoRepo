import { makeAutoObservable } from "mobx";
import { Undef } from "../../common/types";
import { Store } from "../RootStore";



export class CartStore {
  rootStore: Store
  constructor(rootStore: Store) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  items: Array<CouseInCart> = [];
  totalPrice = 0;

  get isEmpty() {
    return !this.items.length
  }

  findItem(vcode: number) {
    return this.items.find((item) => item.couse.VCode == vcode)
  }

  addCourseToCart(couse: CourseItem) {
    let isCourseAdded: Undef<CouseInCart>;

    isCourseAdded = this.findItem(couse.VCode);

    if (isCourseAdded) {
      isCourseAdded.quantity++
    }
  }

  removeFromCart() {}

  // private applyDiscount(
  //   state: UserCourseCartState,
  //   percentDiscounts: PercentDiscount[],
  //   dishDiscounts: DishDiscount[],
  //   allCampaign: AllCampaignUser[],
  //   dishSet: DishSetDiscount[]
  // ) {
  //   let promo = null;//пока заглушка, т.к. нет промо
  //   let new_state = { ...state }//копируем текущий стейт, для его изменения

  //   let summ: number = 0;//сумма заказа


  //   if (true) {
  //     let dishSets = dishSet;
  //     let dishsDiscounts = dishDiscounts;
  //     //массив сетов, из которых мы нашли данные
  //     let curDishSets: DishSetDiscountActive[] = [];
  //     //проверим все скидки, найдем наибольшую
  //     let maxPercentDiscount: PercentDiscount = { vcode: 0, MinSum: 0, MaxSum: 0, bonusRate: 0, discountPercent: 0 };
  //     percentDiscounts.forEach(a => {
  //       if (maxPercentDiscount.vcode == 0) {
  //         maxPercentDiscount = a;
  //       } else if (maxPercentDiscount.discountPercent < a.discountPercent) {
  //         maxPercentDiscount = a;
  //       }
  //     })
  //     //идём по всем блюдам в корзине
  //     for (let i = 0; i < new_state.itemsInCart.length; i++) {

  //       let courseItem = new_state.itemsInCart[i];
  //       //если есть процентная скидка, сразу её ставим
  //       if (maxPercentDiscount !== null) {
  //         courseItem.campaign = maxPercentDiscount.vcode;
  //         courseItem.priceWithDiscount = courseItem.couse.Price * courseItem.quantity * (100 - maxPercentDiscount.discountPercent) / 100;
  //       } else {
  //         courseItem.priceWithDiscount = courseItem.couse.Price * courseItem.quantity;
  //       }
  //       //идём по всем сэтам и смотрим, сколько у нас наберётся элементов в сэте
  //       for (let j = 0; j < dishSets.length; j++) {
  //         let set = dishSets[j];
  //         //идём по всем блюдам сэта
  //         for (let k = 0; k < set.dishes.length; k++) {
  //           //если нашли блюдо из сэта, то увеличиваем счётчик сэта
  //           if (courseItem.couse.VCode == set.dishes[k].dish) {
  //             let curDishSetObj = curDishSets.find(a => a.vcode == set.vcode);
  //             if (curDishSetObj === undefined) {
  //               curDishSetObj = { ...set, countInCart: 0 };
  //               curDishSets.push(curDishSetObj);
  //             }
  //             curDishSetObj.countInCart += courseItem.quantity;

  //           }
  //         }
  //       }

  //       //идём по всем скидкам на позиции, смотрим что выгоднее, цена по акции или по общей скидки в процентах
  //       for (let j = 0; j < dishsDiscounts.length; j++) {
  //         let dishDiscount = dishsDiscounts[j];
  //         //нашли блюдо в акции
  //         if (courseItem.couse.VCode == dishDiscount.dish && dishDiscount.promocode == promo) {
  //           //если есть процентная скидка
  //           if (courseItem.quantity * dishDiscount.price < courseItem.priceWithDiscount) {
  //             courseItem.campaign = dishDiscount.vcode;
  //             courseItem.priceWithDiscount = courseItem.quantity * dishDiscount.price;
  //           }
  //         }
  //       }

  //     }

  //     for (let j = 0; j < curDishSets.length; j++) {
  //       if (curDishSets[j].countInCart == curDishSets[j].dishCount && curDishSets[j].dishes[0].promocode == promo) {
  //         for (let i = 0; i < new_state.itemsInCart.length; i++) {
  //           let courseItem = new_state.itemsInCart[i];
  //           let dishInSet = curDishSets[j].dishes.find(a => a.dish == courseItem.couse.VCode);
  //           if (dishInSet !== undefined) {
  //             courseItem.campaign = curDishSets[j].vcode;
  //             courseItem.priceWithDiscount = courseItem.quantity * dishInSet.price;
  //           }
  //         }
  //       }
  //     }
  //   }

  //   //new_state.itemsInCart.forEach(a => { a.priceWithDiscount = a.couse.Price * a.quantity; });
  //   new_state.itemsInCart.forEach(a => {

  //     summ += a.priceWithDiscount;
  //   });
  //   new_state.allPriceInCart = summ;
  //   return new_state;
  // }
}