import { Toast } from "antd-mobile";
import { flow, makeAutoObservable } from "mobx";
import { http, logger } from "../../common/features";
import { useTelegram } from "../../common/hooks";
import { LoadStates, LoadStatesType, Optional, Undef } from "../../common/types";
import { Store } from "../RootStore";
import { Modal } from "./MainPageStore";

export class UserInfoStore {
  /** состояние запроса */
  orgstate: LoadStatesType = LoadStates.INITIAL;
  userLoad: LoadStatesType = LoadStates.INITIAL;
  saveOrgLoad: LoadStatesType = LoadStates.INITIAL;


  userState: UserInfoState = {
    Phone: '',
    userName: '',
    UserCode: '',
    userBonuses: 0,
    percentDiscounts: [],
    dishDiscounts: [],
    allCampaign: [],
    dishSet: []
  };
  setUserState(state: UserInfoState) {
    this.userState = state;
  }

  getAllCampaignUserByID(id: string | number) {
    return this.userState.allCampaign.find((actia) => actia.VCode == id)
  }

  /** все организации */
  organizations: Array<Organization> = [];

  /** текущая организация */
  selectedOrganizationID: number = 0;
  
  set currentOrg(val: number) {
    this.selectedOrganizationID = val
  }

  async saveCurrentOrg(newOrgId: number) {
    this.saveOrgLoad = 'LOADING';
    const { userId } = useTelegram();
    try {
      const response: Undef<string> = await http.post(
        '/setUserOrg', 
        { userId, newOrgId }
      )
      if(response) {
        logger.log('Организация успешно сменена', 'User-Info-Store');
        this.saveOrgLoad = 'COMPLETED'
      }
    } catch(err) {
      this.saveOrgLoad = 'FAILED';
    }
  }

  get currentOrg() {
    return this.selectedOrganizationID
  }

  get currentOrganizaion() {
    return this.organizations.find((org) => org.Id == this.selectedOrganizationID) as Organization
  }


  rootStore: Store;
  constructor(rootStore: Store) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  loadUserInfo = flow(function* (
    this: UserInfoStore,
    orgId: number,
    userId: any
  ) {
    this.userLoad = 'LOADING'
    const response = yield http.get('/getUserInfo/' + userId + '/' + orgId)

    const {
      PercentDiscount,
      DishDiscount,
      AllDiscounts,
      SetDishDiscount,
    } = response;
    const Bonuses = response?.UserInfo?.Bonuses ?? 0;
    const NAME = response?.UserInfo?.NAME ?? '';
    /**  "1979064" numberstr */
    const UserCode = response?.UserInfo?.UserCode ?? '';
    const COrg = response?.UserInfo?.COrg ?? 0;
    const Phone = response?.UserInfo?.Phone ?? '';

    if(response?.UserInfo) {
      this.rootStore.auth.setState('AUTHORIZED')
      this.rootStore.auth.setCurrentStage('authorized_successfully')
      logger.log("Мы авторизованы в Гурмаге", "GET /loadUserInfo")
      this.rootStore.auth.tg_user_ID = userId
    } else {
      logger.log('Похоже пользователь не зареган в ГУРМАГ', 'GET /loadUserInfo')
      logger.log("Мы не авторизованы в Гурмаге", "GET /loadUserInfo")
      this.rootStore.auth.setCurrentStage('input_tel_number')
      this.rootStore.auth.setState('NOT_AUTHORIZED')
    }

    const newState = {
      userName: NAME,
      userBonuses: Bonuses,
      percentDiscounts: PercentDiscount,
      dishDiscounts: DishDiscount,
      allCampaign: AllDiscounts,
      dishSet: SetDishDiscount,
      UserCode,
      Phone
    }

    // сохраняем состояние
    this.setUserState(newState)

    // сохраняем текущую организацию 
    // если грузим первый раз
    if(orgId === 0 && COrg !== 0) {
      this.selectedOrganizationID = COrg
      logger.log("получили и засетали новый OrgId " + COrg, "GET /loadUserInfo")
    };

    // пересчитываем корзину 
    this.rootStore.cartStore.applyDiscountForCart(newState)
    this.userLoad = 'COMPLETED'
    return response?.UserInfo || null
  })

  loadOrganizations = flow(function* (
    this: UserInfoStore
  ) {
    this.orgstate = 'LOADING';
    try {
      this.organizations = yield http.get('/GetOrgForWeb');
      this.orgstate = 'COMPLETED'
    } catch (err) {
      const errStr = 'Не удалось загрузить организации'
      logger.error(errStr, 'User-Info-Store')
      Toast.show({
        content: errStr, 
        position: 'center'
      })
    }
  })




  get needAskAdress() {
    return this.selectedOrganizationID == 142 || this.selectedOrganizationID == 0
  }

  /** история заказов */
  orderHistory: historyOrderItem[] = []
  /** просматриваемый закза */
  selectedHistoryOrder: Optional<historyOrderItem> = null

  watchHistoryOrderModal = new Modal();

  watchHistoryOrder(selectedHistoryOrder: historyOrderItem) {
    this.selectedHistoryOrder = selectedHistoryOrder;
    this.watchHistoryOrderModal.open();
  }
  closeHistoryOrder() {
    this.selectedHistoryOrder = null;
    this.watchHistoryOrderModal.close();
  }

  orderHistoryState: LoadStatesType = 'INITIAL'

  loadOrdersHistory = flow(function* (
    this: UserInfoStore, 
    userId: string
  ) {
    this.orderHistoryState = 'LOADING';
    try {
      const response: Undef<historyOrderItem[]> = yield http.get('GetUserOrdersHistory/' + userId);
      if(response?.length) {
        this.orderHistory = [];
        response.forEach(order => 
          this.orderHistory.push(order)
        )
        this.orderHistoryState = 'COMPLETED';
      }
    } catch (err) {
      logger.error(err, 'user-info-store')
      this.orderHistoryState = 'FAILED';
    }
  })
}