import { makeAutoObservable } from "mobx";
import { logger } from "../../common/features";
import { LoadStates, LoadStatesType, Optional } from "../../common/types";
import { Store } from "../RootStore";


export class ActionsPageStore {
  state: LoadStatesType = LoadStates.INITIAL;
  get isLoading() {
    return this.state === LoadStates.LOADING
  }

  categories: Array<string> = ['Общие', 'Персональные']; // todo
  rootStore: Store
  constructor(rootStore: Store) {
    makeAutoObservable(this)
    this.rootStore = rootStore
  }

  /** категория акций, которая видна на экране */
  visibleCategory: Optional<string> = null;

  setVisibleCategory(categoryId: Optional<string>) {
    this.visibleCategory = categoryId;
  }

  
  onFailure(err: unknown) {
    logger.error(err, ActionsPageStore.name)
    // todo показывать сообщение об 
    // ошибке пользователю на экарне
    this.state = 'FAILED';
  }
  onSuccess(successText?: string) {
    if (successText)
      logger.log(successText, ActionsPageStore.name);

    this.state = 'COMPLETED';
  }
  onStart() {
    this.state = 'LOADING';
  }
}