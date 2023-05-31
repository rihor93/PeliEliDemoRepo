import { CourseItem } from "../reducers/menuData/menuDataLoadTypes";

export const ADD_COURSE = 'ADD_COURSE'
export const DELETE_COURSE = 'DELETE_COURSE'
export const APPLE_DISCOUNT = 'APPLE_DISCOUNT'

export const SET_USER_INFO = 'SET_USER_INFO'

export type USER_ACTIONS_TYPE = typeof ADD_COURSE | typeof DELETE_COURSE | typeof APPLE_DISCOUNT | typeof SET_USER_INFO;

export interface UserCourseCartState {
    cartEmpty: boolean,
    itemsInCart: CourseInCart[],
    allPriceInCart: number,
    userInfo?: UserInfoDatas,
}

export type CourseInCart = {
    couse: CourseItem,
    quantity: number,
    priceWithDiscount: number,
    campaign?: number,
}

export type PercentDiscount = {
    vcode: number,
    MinSum: number,
    MaxSum: number,
    bonusRate: number,
    discountPercent: number,
}

export type DishDiscount = {
    vcode: number,
    isset: number,
    quantity: number,
    promocode: string,
    dish: number,
    price: number,
}

export type DishSetDiscount = {
    vcode: number,
    dishes: DishDiscount[],
    dishCount: number,
}

export interface DishSetDiscountActive extends DishSetDiscount {
    countInCart: number,
}

export type AllCampaignUser = {
    Name: string,
    Description: string,
    VCode: number,
    periodtype: string,
    isset: number,
    quantity: number,
    promocode: string
}

export type UserInfoDatas = {
    userName: string,
    userBonuses: number,
    percentDiscounts: PercentDiscount[],
    dishDiscounts: DishDiscount[],
    allCampaign: AllCampaignUser[],
    dishSet: DishSetDiscount[],
}

interface SetUserCourseAction {
    type: USER_ACTIONS_TYPE;
    payload: CourseItem | UserInfoDatas | number;
}


export type UserStateCourseActionTypes = SetUserCourseAction;
