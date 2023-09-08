/** Тип блюда */
type CourseItem = {
  VCode: number,
  Name: string,
  CatVCode: number,
  Price: number,
  Quality: number,
  /**блюдо готовится на точке, работает без остатко */
  NoResidue: boolean,
  /** текущий остаток на точке */
  EndingOcResidue: number
}

/** Тип категории с блюдами */
type CategoryCourse = {
  VCode: number,
  Name: string,
  MenuVCode: number,
  CourseList: CourseItem[],
  /** пока нигде не используется */
  Quality: number,
}

/** Блюдо в корзине как часть заказа */
type CouseInCart = {
  couse: CourseItem;
  quantity: number;
  priceWithDiscount: number;
  campaign?: number | undefined;
}

type PercentDiscount = {
  vcode: number,
  MinSum: number,
  MaxSum: number,
  bonusRate: number,
  discountPercent: number,
}

type DishDiscount = {
  vcode: number,
  isset: number,
  quantity: number,
  promocode: string,
  dish: number,
  price: number,
}

type DishSetDiscount = {
  vcode: number,
  dishes: DishDiscount[],
  dishCount: number,
}

interface DishSetDiscountActive extends DishSetDiscount {
  countInCart: number,
}

type AllCampaignUser = {
  Name: string,
  Description: string,
  VCode: number,
  periodtype: string,
  isset: number,
  quantity: number,
  promocode: string
}

/** Организация */
type Organization = {
  Id: number,
  Name: string,
  isCK: number,
}

type UserInfoState = {
  Phone: string,
  userName: string,
  /** кол-во каких-то бонусов */
  userBonuses: number, 
  /** это детали основных акций: сидка N процентов на cумму от A до B */
  percentDiscounts: PercentDiscount[],
  /** это детали основных акций: скидка на какое-то блюдо */
  dishDiscounts: DishDiscount[],
  /** это основыне акции */
  allCampaign: AllCampaignUser[],
  /** это детали основных акций: скидка на сет из блюд */
  dishSet: DishSetDiscount[],
}

type UserCoursePayload = {
  couse: CourseItem,
  percentDiscounts: PercentDiscount[],
  dishDiscounts: DishDiscount[],
  allCampaign: AllCampaignUser[],
  dishSet: DishSetDiscount[],
}

/** Работник */
type Cook = {
  UserId: string,
  Rating: number,
  FirstName: string,
  NameWork: string,
}

/** отзыв на каждое блюдо работника */
type CookReviews = { 
  Rating: number
  /** название категории */
  Category: string,
  /** название блюда */
  Course: string,
  /** название сотрудника */
  FIO: string,
  /** 2023-08-15T15:53:23.745Z */
  Date: string, 
  /** "79174308652" */
  Phone: string,
}

/** заказ */
type Order = {
  itemsInCart: Array<CouseInCart>,
  /** userid str - "187151411" */
  userId:string, 
  /** current org number str - "115" */
  currentOrg: string,
  /** phone number str - "79273067412" */ 
  contactPhone: string,
  /** ISOdate str - "2023-08-24T07:55:07.983Z" */
  orderDate: string
}

type CourseOtzyv = {
  /** 2023-09-08T04:38:41.173Z */
  Date: string,
  /** "Жанна" */
  FIO: string,
  /** "79899559625" */
  Phone: string,
  /** "5" */
  Rating: string,
}