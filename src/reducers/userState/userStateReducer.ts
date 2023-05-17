import { CourseItem } from '../../types/menuDataLoadTypes';
import { ADD_COURSE, CourseInCart, DELETE_COURSE, UserCourseCartState, UserStateCourseActionTypes, UserInfoDatas, SET_USER_INFO, DishSetDiscount, DishSetDiscountActive, PercentDiscount } from '../../types/userStateCourseTypes';

const initialState: UserCourseCartState = {
    cartEmpty: false,
    itemsInCart: [] as CourseInCart[],
    allPriceInCart: 0,
    userInfo: undefined,
};

export const userCourseCartReducer = (state = initialState, action: UserStateCourseActionTypes): UserCourseCartState => {
    let payloadCourseItem: CourseItem = { VCode: -1, Name: '', CatVCode: -1, Discount_Price: 0, Price: 0 };
    let payloadUserInfoDatas: UserInfoDatas = { userName: '', userBonuses: 0, percentDiscounts: [], dishDiscounts: [], allCampaign: [], dishSet: [] };
    switch (action.type) {
        case ADD_COURSE:
            payloadCourseItem = action.payload as CourseItem;
            break;
        case DELETE_COURSE:
            payloadCourseItem = action.payload as CourseItem;
            break;
        case SET_USER_INFO:
            payloadUserInfoDatas = action.payload as UserInfoDatas;
            break;
        default:
            break;
    }


    switch (action.type) {

        case ADD_COURSE:

            let course_add: CourseInCart | undefined;
            course_add = state.itemsInCart.find(a => a.couse.VCode === payloadCourseItem.VCode)
            if (course_add !== null && course_add !== undefined) {
                course_add.quantity++;
                return applyDicountsAndCoursePrivate({
                    ...state,
                    itemsInCart: state.itemsInCart.map(a => a.couse.VCode == payloadCourseItem.VCode ? (course_add as CourseInCart) : a),
                });

            }

            return applyDicountsAndCoursePrivate({
                ...state,
                itemsInCart: [...state.itemsInCart, { couse: payloadCourseItem, quantity: 1, priceWithDiscount: payloadCourseItem.Price }],
            });
        case DELETE_COURSE:
            let course: CourseInCart | undefined;
            course = state.itemsInCart.find(a => a.couse.VCode === payloadCourseItem.VCode)
            if (course !== null && course !== undefined) {
                if (course.quantity > 1) {
                    course.quantity--;

                    return applyDicountsAndCoursePrivate({
                        ...state,
                        itemsInCart: state.itemsInCart.map(a => a.couse.VCode == payloadCourseItem.VCode ? (course as CourseInCart) : a),
                    });
                }
                else {
                    return applyDicountsAndCoursePrivate({
                        ...state,
                        itemsInCart: state.itemsInCart.filter(a => a.couse.VCode != payloadCourseItem.VCode),
                    });
                }
            }
            return state;
        case SET_USER_INFO:
            return { ...state, userInfo: payloadUserInfoDatas }
        default:
            return state;

    }

};


function applyDicountsAndCoursePrivate(state: UserCourseCartState): UserCourseCartState {
    let promo = '';//пока заглушка, т.к. нет промо
    let new_state = { ...state }//копируем текущий стейт, для его изменения

    let summ: number = 0;//сумма заказа
    

    if (new_state.userInfo != undefined) {
        //let dishSetCopy = {...new_state.userInfo.dishSet}
        let dishSets = new_state.userInfo.dishSet;
        let dishsDiscounts = new_state.userInfo.dishDiscounts;
        //массив сетов, из которых мы нашли данные
        let curDishSets: DishSetDiscountActive[] = [];
        //проверим все скидки, найдем наибольшую
        let maxPercentDiscount: PercentDiscount = { vcode: 0, MinSum: 0, MaxSum: 0, bonusRate: 0, discountPercent: 0 };
        new_state.userInfo.percentDiscounts.forEach(a => {
            if (maxPercentDiscount.vcode == 0) {
                maxPercentDiscount = a;
            } else if (maxPercentDiscount.discountPercent < a.discountPercent) {
                maxPercentDiscount = a;
            }
        })
        //идём по всем блюдам в корзине
        for (let i = 0; i < new_state.itemsInCart.length; i++) {

            let courseItem = new_state.itemsInCart[i];
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
                        /*if (set.curDishCount !== undefined){
                            set.curDishCount += courseItem.quantity;
                        } else {
                            set.curDishCount = courseItem.quantity;
                        }*/
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
                        courseItem.priceWithDiscount = courseItem.quantity * dishDiscount.price;
                    }
                }
            }

        }

        for (let j = 0; j < curDishSets.length; j++) {
            if (curDishSets[j].countInCart == curDishSets[j].dishCount && curDishSets[j].dishes[0].promocode == promo) {
                for (let i = 0; i < new_state.itemsInCart.length; i++) {
                    let courseItem = new_state.itemsInCart[i];
                    let dishInSet = curDishSets[j].dishes.find(a => a.dish == courseItem.couse.VCode);
                    if (dishInSet !== undefined) {
                        courseItem.campaign = curDishSets[j].vcode;
                        courseItem.priceWithDiscount = courseItem.quantity * dishInSet.price;
                    }
                }
            }
        }
        //console.log({ curDishSets })
    } else {
        new_state.itemsInCart.forEach(a => {

            a.priceWithDiscount = a.couse.Price * a.quantity;
        });
    }

    //new_state.itemsInCart.forEach(a => { a.priceWithDiscount = a.couse.Price * a.quantity; });
    new_state.itemsInCart.forEach(a => {

        summ += a.priceWithDiscount;
    });
    new_state.allPriceInCart = summ;
    return new_state;
}

export function addCourseToCart(couse: CourseItem) {
    return {
        type: ADD_COURSE,
        payload: couse,
    };
}

export function dropCourseFromCart(couse: CourseItem) {
    return {
        type: DELETE_COURSE,
        payload: couse,
    };
}

export function setUserInfoData(userData: UserInfoDatas) {
    return {
        type: SET_USER_INFO,
        payload: userData,
    };
}

