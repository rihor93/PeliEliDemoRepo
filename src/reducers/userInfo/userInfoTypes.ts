export const FETCH_DATA_REQUEST = 'USER_INFO_FETCH_DATA_REQUEST'
export const FETCH_DATA_SUCCESS = 'USER_INFO_FETCH_DATA_SUCCESS'
export const FETCH_DATA_FAILURE = 'USER_INFO_FETCH_DATA_FAILURE'

export type FETCH_DATA = typeof FETCH_DATA_REQUEST | typeof FETCH_DATA_SUCCESS | typeof FETCH_DATA_FAILURE;

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

export interface UserInfoState {
    userName: string,
    userBonuses: number,
    percentDiscounts: PercentDiscount[],
    dishDiscounts: DishDiscount[],
    allCampaign: AllCampaignUser[],
    dishSet: DishSetDiscount[],
}

export interface UserInfoLoadState {
    loading: boolean,
    data: UserInfoState,
    error: string,
}

interface SetUserInfoAction {
    type: FETCH_DATA,
    payload: UserInfoLoadState,
}


export type UserInfoActionTypes = SetUserInfoAction;