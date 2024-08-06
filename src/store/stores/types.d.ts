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
  EndingOcResidue: number,
  CourseDescription: string,
  Weigth: string,
  Images: undefined | string[],
  CompressImages: undefined | string[],
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
  discountPercent: number,
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
  isCK: boolean,
}

type UserInfoState = {
  Phone: string,
  userName: string,
  /** numberStr "182981928" */
  UserCode: string,
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
  orderDate: string,

  fullAddress: string | null
  orderType: number | null
  promocode: string
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

type V3_userInfoResponse = { 
  BaseMenu: Array<CategoryCourse>
  PopularMenu: Array<CourseItem>
}

type historyOrderItem = {
  /** !number string "99328" */
  VCode: string,
  /** !number string "11676" */
  DocumentNumber: string,
  /** iso string "2023-09-06T00:00:00.000Z" */
  DocumentDate: string,
  /** iso string "1970-01-01T18:09:58.627Z" */
  DeliveryTime: string,
  StatusOrder: OrderStatuses,
  PaymentStatus: PaymentStatuses,
  /** "Рабкоров_20" */
  OrgName: string,
  OrgCode: number,
  OrderCost: number,
  Courses: historyOrderCouse[],
  /** "На вынос" или "С доставкой" */
  OrderType: string,
  FullAddress: null | string
}

type historyOrderCouse = {
  CourseCost: number,
  CourseQuantity: number,
  /** !!! number string "89089" */
  CourseCode: string,
  CourseName: string
}

type PaymentStatuses = 'Не оплачен' | 'Оплачен частично' | 'Оплачен'
type OrderStatuses = 'Создан' | 'В работе' | 'Сборка заказа' | 'В пути' | 'Оплачен' | 'Отменён'

type Slot = {
  /** example "6" */
  VCode: string,
  /** example "Вечер" */
  Name: string,
  /** example "1970-01-01T18:00:12.024Z" */
  Start: string,
  /** example "1970-01-01T21:00:14.726Z" */
  End: string,
  /** example "1970-01-01T17:00:22.619Z" */
  EndTimeOfWork: string,
  /** example "1970-01-01T17:00:22.588Z" */
  StartCook: string,
}