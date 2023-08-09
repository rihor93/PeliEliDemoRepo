import { makeAutoObservable } from "mobx";
import { logger } from "../../common/features";
import { LoadStates, LoadStatesType, Optional } from "../../common/types";
import { Store } from "../RootStore";
import { Modal } from "./MainPageStore";


export class ActionsPageStore {
  /** состояние запросов стора */
  state: LoadStatesType = LoadStates.INITIAL;
  get isLoading() {
    return this.state === LoadStates.LOADING
  }

  /** основные категории акций */
  categories: Array<string> = ['Персональные', 'Общие'];
  rootStore: Store
  constructor(rootStore: Store) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
    this.watchAction = this.watchAction.bind(this);
  }

  /** окошко просмотра акции */
  watchActionModal = new Modal()
  /** окошко просмотра блюда */
  watchCouseModal = new Modal()

  selectedAction: Optional<AllCampaignUser> = null
  watchAction(selectedAction: Optional<AllCampaignUser>) {
    this.selectedAction = selectedAction;
    this.watchActionModal.open()
  }

  watchingCourse: Optional<CourseItem> = null

  /** категория акций, которая видна на экране */
  visibleCategory: Optional<string> = null;

  setVisibleCategory(categoryId: Optional<string>) {
    this.visibleCategory = categoryId;
  }


  /** если запрос упал */
  onFailure(err: unknown) {
    logger.error(err, ActionsPageStore.name)
    // todo показывать сообщение об 
    // ошибке пользователю на экарне
    this.state = 'FAILED';
  }
  /** если все нормально */
  onSuccess(successText?: string) {
    if (successText)
      logger.log(successText, ActionsPageStore.name);

    this.state = 'COMPLETED';
  }
  /** когда начинаем что-то грузить */
  onStart() {
    this.state = 'LOADING';
  }
}