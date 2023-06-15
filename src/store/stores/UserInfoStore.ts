import { flow, makeAutoObservable } from "mobx";
import { http } from "../../common/features";
import { useTelegram } from "../../common/hooks";
import { Store } from "../RootStore";

export class UserInfoStore {
  rootStore: Store;
  constructor(rootStore: Store) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }
 // todo доделать всеy
  // userName: string;
  // userBonuses: number;
  // percentDiscounts: PercentDiscount[];
  // dishDiscounts: DishDiscount[];
  // allCampaign: AllCampaignUser[];
  // dishSet: DishSetDiscount[];

  loadUserInfo = flow(function* (
    this: UserInfoStore,
    orgId: number
  ) {
    const { userId } = useTelegram();
    const response = yield http.get('/getUserInfo/' + userId + '/' + orgId)
    // пересчитываем корзину 
    // сохраянем скидки в этот стор
  })
}