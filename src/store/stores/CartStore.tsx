import { CreditCardOutlined } from "@ant-design/icons";
import { Toast, Modal as Modalz } from "antd-mobile";
import { ToastHandler } from "antd-mobile/es/components/toast";
import { flow, makeAutoObservable, toJS } from "mobx";
import moment from "moment";
import { http, logger, setItem } from "../../common/features";
import { isDevelopment } from "../../common/helpers";
import { useTelegram } from "../../common/hooks";
import { LoadStatesType, Optional, Undef } from "../../common/types";
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
    if (text?.length) {
      Toast.show({
        icon: 'success',
        content: text,
        position: 'center',
      })
    }
    this.state = 'COMPLETED'
  }
  onFailure(errStr: string) {
    if (errStr.length) {
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

    this.availableSlotCheckerID = setInterval(this.checkAvailableSlot, 60000)
  }


  confirmOrderModal = new Modal();

  items: Array<CouseInCart> = [];
  totalPrice = 0;

  clearCart() {
    this.items = [];
    this.totalPrice = 0;
    setItem('cartItems', [])
  }

  clearCousesById(vcode: number) {
    this.items = this.items.filter(item =>
      item.couse.VCode !== vcode
    )
  }

  get isEmpty() {
    return !this.items.length
  }

  findItem(vcode: number) {
    return this.items.find((item) => item.couse.VCode == vcode)
  }

  isInCart(course: CourseItem): boolean {
    return Boolean(this.items.find(item => item.couse.VCode === course.VCode))
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
              if (dishDiscount.price) {
                courseItem.priceWithDiscount = courseItem.quantity * dishDiscount.price;
              }
              // если нет прайса но есть скидочный процент
              // @ts-ignore
              if (dishDiscount.discountPercent) {
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
              if (dishInSet.price) {
                courseItem.priceWithDiscount = courseItem.quantity * dishInSet.price;
              }
              // если нет прайса но есть скидочный процент
              // @ts-ignore
              if (dishInSet.discountPercent) {
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
    if (load === 'COMPLETED' && cookstate === 'COMPLETED') setItem('cartItems', state.items)
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

  /** апи оформления заказа */
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
        duration: 0 // висит бесконечно
      })
      let orgID = order.currentOrg
      if(order.orderType === 2) {
        const ResultBlyat = yield this.deliveryForm.getNearestDeliveryPoint(order.fullAddress as string)
        orgID = ResultBlyat.Id
        // @ts-ignore
        order = { ...order, activeSlot: Number(this.selectedSlot?.VCode) }
      }

      // if(isDevelopment()) {
      if(true) {
        //@ts-ignore
        orgID = 146
      }
      const response: [historyOrderItem] = yield http.post('/NewOrderSlot', {
        ...order, currentOrg: orgID
      });
      if (response?.[0]) {
        logger.log('Заказ успешно оформлен', 'cart-store')
        handler.current?.close()
        this.onSuccess('Заказ успешно оформлен')
        this.clearCart()
        this.rootStore.userStore.orderHistory.push(response[0])
      };
    } catch (e) {
      logger.log('Заказ блин не оформился', 'cart-store')
      this.onFailure('Не удалось оформить заказ')
    }
  })

  payOrder = async (orderId: number) => {
    type resultType = { redirectUrl: string }
    const result: resultType = await http.post("/PayOrder", { orderId })
    const tg = useTelegram()
    if(tg.isInTelegram()) {
      tg.tg.openTelegramLink(result.redirectUrl);
    } else {
      window.open(result.redirectUrl); 
    }
  }

  deliveryOptions = [
    {
      label: 'Самовывоз',
      value: receptionTypes.pickup as ReceptionType,
    },
    {
      label: 'Доставка',
      value: receptionTypes.delivery as ReceptionType,
    }
  ]

  deliveryForm = new DeliveryForm(this)
  selectSlotPopup = new Modal()

  selectedSlot: Optional<Slot> = null
  setSelectedSlot = (slot:Slot) => { this.selectedSlot = slot }
  slots: Slot[] = []

  availbaleSlots: Slot[] = []

  isSlotActive = function (slot: Slot) {
    const [eHH, eMM] = moment(slot.EndTimeOfWork)
      .format('HH:mm')
      .split(':')
      .map(toNumb)

    const [nowHH, nowMM] = moment()
      .format('HH:mm')
      .split(':')
      .map(toNumb)
    
    return (nowHH * 60 + nowMM) < (eHH * 60 + eMM)
  }

  getTimeString = (slot: Slot) => 
    moment(slot.Start).format('HH:mm') +
    ' - ' +
    moment(slot.End).format('HH:mm')

  slotloading: LoadStatesType = 'INITIAL'

  getSlots = async () => {
    this.slotloading = 'LOADING'
    const slots: Slot[] = await http.get('/getActiveSlots')
    if(slots && Array.isArray(slots)) {
      this.slots = slots
      this.checkAvailableSlot()
      this.slotloading = 'COMPLETED'
    } else {
      this.slotloading = 'FAILED'
      logger.error('Не удалось получить слоты')
    }
  }
  private availableSlotCheckerID: ReturnType<typeof setTimeout>
  private checkAvailableSlot = () => {
    this.availbaleSlots = this.slots.filter(this.isSlotActive)
    if(this.selectedSlot && !this.availbaleSlots.find(slot => slot.VCode === this.selectedSlot?.VCode)) {
      this.selectedSlot = null
    }
  }

  paymentSelector = new PaymentSelector(this)
}

function toNumb(str: string) { return Number(str) }

class DeliveryForm {
  constructor(readonly parrent: CartStore) {
    makeAutoObservable(this)
  }
  /**
   * точки с которых ведется доставка
   */
  deliveryPoints: Array<Organization> = [
    {
      Id: 2,
      Name: "Рабкоров_20",
      isCK: false
    },
    {
      Id: 140,
      Name: "Российская_43",
      isCK: false
    }
  ]

  private getCordinatesByAddr = async (address: string) => {
    const result: YandexGeocodeResponse = await http.get('https://geocode-maps.yandex.ru/1.x/', {
      apikey: this.apikey,
      geocode: address,
      format: 'json'
    })
    const cord = result?.response?.GeoObjectCollection?.featureMember[0]?.GeoObject?.Point?.pos ?? undefined
    if (cord) {
      const [dolgota, shirota] = cord.split(' ').map(str => Number(str))
      logger.log(`Нашли кординаты d = ${dolgota} sh = ${shirota} для ${address}`)
      return { dolgota, shirota }
    } else {
      logger.log('Не нашли кординаты((((')
      return { dolgota: undefined, shirota: undefined }
    }
  }

  getNearestDeliveryPoint = async (
    inputAddress: string
  ) => {
    // console.log(`///////////// - input address: ${inputAddress}`)
    // сначала находим кординаты адреса для доставки
    const { dolgota, shirota } = await this.getCordinatesByAddr('Уфа, ' + inputAddress)
    // console.log(`///////////// - input addr dolgota and shirota: ${dolgota} & ${shirota}`)


    let resultOrganization
    let minDistance
    // потом пробегаемся по всех доступным организациям 
    // и ищем ту орг, которая ближе всех
    for (const org of this.deliveryPoints) {
      console.log(`/////////////: ${org.Name} in loop`)

      // для каждой организации захардкодил кординаты 
      // каждый раз их узнавать заного смысла нет
      const isCordsKnown = this.addrsBindings
        .find(o => o.Name === org.Name)
      console.log(`///////////// - is cords known for ${org.Name}: ${isCordsKnown?.pos}`)


      let orgDolgota, orgShirota
      // если организация есть в захардкоженных
      // кординатах то берем кор-ты оттуда
      if (isCordsKnown) {
        [orgDolgota, orgShirota] = isCordsKnown.pos
          .split(' ')
          .map(str => Number(str))

        /** расстояние */
        const distance = this.distance(shirota, dolgota, orgShirota, orgDolgota)
        console.log(`///////: calced distance between ${inputAddress} and ${org.Name}: ${distance}`)
        console.log(`///////: min distance curr: ${minDistance}`)
        if (minDistance) {
          if (distance < minDistance) {
            minDistance = distance
            resultOrganization = org
          }
        } else {
          minDistance = distance
          resultOrganization = org
        }
      } else {

        // если нет то 
        // делаем запрос и узнаем кординаты
        logger.log(`Кординаты для точки ${org.Name} придется загрузить`)
        const orgPos = await this.getCordinatesByAddr('Уфа, ' + org.Name)
        /** расстояние */
        const distance = this.distance(shirota, dolgota, orgPos.shirota, orgPos.dolgota)
        console.log(`///////: calced distance between ${inputAddress} and ${org.Name}: ${distance}`)
        console.log(`///////: min distance curr: ${minDistance}`)
        if (minDistance) {
          if (distance < minDistance) {
            minDistance = distance
            resultOrganization = org
          }
        } else {
          minDistance = distance
          resultOrganization = org
        }
      }
    }
    return resultOrganization as Organization
  }

  distance(lat1: any, lon1: any, lat2: any, lon2: any, unit: 'M' | 'K' | 'N' = 'K') {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1 / 180;
      var radlat2 = Math.PI * lat2 / 180;
      var theta = lon1 - lon2;
      var radtheta = Math.PI * theta / 180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") { dist = dist * 1.609344 }
      if (unit == "N") { dist = dist * 0.8684 }
      return dist;
    }
  }

  private apikey = '33b1e7b5-85f4-446d-b160-5fc311c21b21'



  /** известные кординаты точек выдачи */
  addrsBindings = [
    {
      Id: 2,
      isCK: false,
      Name: "Рабкоров_20",
      pos: "56.002691 54.70186"
    },
    {
      Id: 115,
      isCK: false,
      Name: "Жукова_10",
      pos: "56.059599 54.770162"
    },
    {
      Id: 140,
      isCK: false,
      Name: "Российская_43",
      pos: "56.03653 54.77791"
    },
    {
      Id: 141,
      isCK: false,
      Name: "Гафури_4",
      pos: "55.928068 54.723413"
    },
    {
      Id: 144,
      isCK: false,
      Name: "Ферина_19",
      pos: "56.131958 54.781597"
    },
    {
      Id: 147,
      isCK: false,
      Name: "Первомайская_70",
      pos: "56.099008 54.810361"
    }
  ]
}

export const PaymentWays = {
  CASH: "CASH",
  CARD: "CARD",
} as const

export type PaymentWay = typeof PaymentWays[keyof typeof PaymentWays];

class PaymentSelector {
  paymentWays = Object.keys(PaymentWays) as PaymentWay[]
  paymentLabels = {
    [PaymentWays.CARD]: 'Картой',
    [PaymentWays.CASH]: 'Наличными',
  }
  iconstyle = { marginRight: '0.75rem', fontSize: 25 }
  paymentIcons = {
    [PaymentWays.CARD]: <CreditCardOutlined style={this.iconstyle} />,
    [PaymentWays.CASH]: <span style={this.iconstyle}>₽</span>,
  }
  selectedPaymentWay:PaymentWay = PaymentWays.CASH
  setPayementWaySelected = (way: PaymentWay) => {
    this.selectedPaymentWay = way
  }
  constructor(readonly parrent: CartStore) {
    makeAutoObservable(this)
  }

  selectWayPopup = new Modal()
}

type YandexGeocodeResponse = {
  response: {
    GeoObjectCollection: {
      metaDataProperty: {
        GeocoderResponseMetaData: {
          Point: {
            /** example "56.002691 54.70186" */
            pos: string
          },
          /** example "56.002691,54.70186" */
          request: string,
          /** example "10" */
          results: string,
          /** example "10" */
          found: string
        }
      },
      featureMember: Array<GeoObject>
    }
  }
}
type GeoObject = {
  GeoObject: {
    metaDataProperty: {
      GeocoderMetaData: {
        /** example "exact" */
        precision: string,
        /** example "Россия, Республика Башкортостан, Уфа, улица Рабкоров, 20" */
        text: string,
        /** example "house" */
        kind: string,
        Address: {
          /** example "RU" */
          country_code: string,
          /** example "Россия, Республика Башкортостан, Уфа, улица Рабкоров, 20" */
          formatted: string,
          /** example "450092" */
          postal_code?: string,
          Components: Array<{
            /** example "house" */
            kind: string,
            /** example "20" */
            name: string
          }>
        },
        AddressDetails: {
          Country: {
            /** example "Россия, Республика Башкортостан, Уфа, улица Рабкоров, 20" */
            AddressLine: string,
            /** example "RU" */
            CountryNameCode: string,
            /** example "Россия" */
            CountryName: string,
            AdministrativeArea?: {
              /** example "Республика Башкортостан" */
              AdministrativeAreaName: string,
              SubAdministrativeArea?: {
                /** example "городской округ Уфа" */
                SubAdministrativeAreaName?: string,
                /** example "Республика Башкортостан" */
                AdministrativeAreaName?: string,
                Locality?: {
                  /** example "Уфа" */
                  LocalityName: string,
                  Thoroughfare?: {
                    /** example "улица Рабкоров" */
                    ThoroughfareName: string,
                    Premise?: {
                      /** example "20" */
                      PremiseNumber: string,
                      PostalCode: {
                        /** example "450092" */
                        PostalCodeNumber: string
                      }
                    }
                  },
                  DependentLocality?: {
                    /** example "Кировский район" */
                    DependentLocalityName: string,
                    DependentLocality?: {
                      /** example "Кировский район" */
                      DependentLocalityName: string,
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    /** example "улица Рабкоров, 20" */
    name: string,
    /** example "Уфа, Республика Башкортостан, Россия" */
    description?: string,
    boundedBy: {
      Envelope: {
        /** example "55.998585 54.699482" */
        lowerCorner: string,
        /** example "56.006796 54.704238" */
        upperCorner: string,
      }
    },
    /** example "ymapsbm1://geo?data=IgoNwQJgQhW0zlpC" */
    uri: string,
    Point: {
      /** example "56.002691 54.70186" */
      pos: string
    }
  }
}