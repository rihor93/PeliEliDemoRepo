import { flow, makeAutoObservable } from "mobx";
import { http, logger } from "../../common/features";
import { useTelegram } from "../../common/hooks";
import { LoadStates, LoadStatesType } from "../../common/types";
import { Store } from "../RootStore";

export class UserInfoStore {
  /** состояние запроса */
  state: LoadStatesType = LoadStates.INITIAL;

  get isLoading() { return this.state === 'LOADING' }


  userState: UserInfoState = {
    userName: '',
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

  get currentOrg() {
    return this.selectedOrganizationID
  }


  rootStore: Store;
  constructor(rootStore: Store) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  loadUserInfo = flow(function* (
    this: UserInfoStore,
    orgId: number
  ) {
    const { userId } = useTelegram();
    const response = yield http.get('/getUserInfo/' + userId + '/' + orgId)

    const {
      PercentDiscount,
      DishDiscount,
      AllDiscounts,
      SetDishDiscount,
    } = response;
    const Bonuses = response?.UserInfo?.Bonuses ?? 0;
    const NAME = response?.UserInfo?.NAME ?? '';
    const COrg = response?.UserInfo?.COrg ?? 0;

    if(!response?.UserInfo) {
      logger.log('Похоже пользователь не зареган в ГУРМАГ', 'GET /loadUserInfo')
    }

    const newState = {
      userName: NAME,
      userBonuses: Bonuses,
      percentDiscounts: PercentDiscount,
      dishDiscounts: DishDiscount,
      allCampaign: AllDiscounts,
      dishSet: SetDishDiscount,
    }

    // сохраняем состояние
    this.setUserState(newState)

    // сохраняем текущую организацию 
    // если грузим первый раз
    if(orgId === 0) this.selectedOrganizationID = COrg;

    // пересчитываем корзину 
    this.rootStore.cartStore.applyDiscountForCart(newState)
  })

  loadOrganizations = flow(function* (
    this: UserInfoStore
  ) {
    this.onStart()
    try {
      this.organizations = yield http.get('/GetOrgForWeb');
      this.onSuccess();
    } catch (err) {
      this.onFailure(err);
    }
  })

  onFailure(err: unknown) {
    logger.error(err, UserInfoStore.name)
    // todo показывать сообщение об 
    // ошибке пользователю на экарне
    this.state = 'FAILED';
  }

  onSuccess(successText?: string) {
    if (successText) logger.log(successText, UserInfoStore.name);
    this.state = 'COMPLETED';
  }

  onStart() { this.state = 'LOADING'; }
}