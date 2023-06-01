import { CourseItem } from "../menuData/menuDataLoadTypes";
import { AllCampaignUser, DishDiscount, DishSetDiscount, PercentDiscount } from "../userInfo/userInfoTypes";

export const ADD_COURSE = 'ADD_COURSE'
export const DELETE_COURSE = 'DELETE_COURSE'
export const APPLE_DISCOUNT = 'APPLE_DISCOUNT'



export type USER_ACTIONS_TYPE = typeof ADD_COURSE | typeof DELETE_COURSE | typeof APPLE_DISCOUNT;

export interface UserCourseCartState {
    cartEmpty: boolean,
    itemsInCart: CourseInCart[],
    allPriceInCart: number,
}

export type CourseInCart = {
    couse: CourseItem,
    quantity: number,
    priceWithDiscount: number,
    campaign?: number,
}

export type UserCoursePayload = {
    couse: CourseItem,
    percentDiscounts: PercentDiscount[],
    dishDiscounts: DishDiscount[],
    allCampaign: AllCampaignUser[],
    dishSet: DishSetDiscount[],
}

interface SetUserCourseAction {
    type: USER_ACTIONS_TYPE;
    payload: UserCoursePayload;
}

export interface UserCartToServer {
    itemsInCart: CourseInCart[],
    userId: string,
    currentOrg: number,
}


export type SetUserCourseActionTypes = SetUserCourseAction;
