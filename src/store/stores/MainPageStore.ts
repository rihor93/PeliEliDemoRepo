import { flow, makeAutoObservable } from "mobx";
import { http, logger } from "../../common/features";
import { LoadStates, LoadStatesType, Optional } from "../../common/types";
import { Store } from "../RootStore";

export class Modal {
  errors = []
  show = false
  constructor() {
    makeAutoObservable(this);
  }
  open() {
    this.show = true
  }
  close() {
    this.show = false
  }
}

export class MainPageStore {
  state: LoadStatesType = LoadStates.INITIAL;
  rootStore: Store;

  categories: Array<CategoryCourse> = [];

  getDishByID(id: number | string) {
    let all: CourseItem[] = []
    this.categories.forEach((cat) =>
      cat.CourseList.forEach((dish) =>
        all.push(dish)
      )
    )
    return all.find((dish) => dish.VCode == id)
  }

  get isLoading() {
    return this.state === LoadStates.LOADING
  }
  constructor(rootStore: Store) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
    this.watchCourse = this.watchCourse.bind(this);
  }

  itemModal = new Modal();

  /** категория блюд которая видна на экране */
  visibleCategory: Optional<string> = null;
  setVisibleCategory(categoryId: Optional<string>) {
    this.visibleCategory = categoryId;
  }

  /** выбранное блюдо, которое откроется в отдельном окошке */
  selectedCourse: Optional<CourseItem> = null;
  watchCourse(course: Optional<CourseItem>) {
    logger.log('Просматриваем блюдо ' + course?.Name, MainPageStore.name)
    this.selectedCourse = course;
    this.itemModal.open();
  }

  loadMenu = flow(function* (this: MainPageStore) {
    this.onStart();
    try {
      const data: Array<CategoryCourse> = yield http.get('/getUserMenu');
      this.categories = [];
      data.forEach((category) =>
        this.categories.push(category)
      )
      this.onSuccess();
    } catch (err) {
      this.onFailure(err)
    }
  })

  onFailure(err: unknown) {
    logger.error(err, MainPageStore.name)
    // todo показывать сообщение об 
    // ошибке пользователю на экарне
    this.state = 'FAILED';
  }
  onSuccess(successText?: string) {
    if (successText)
      logger.log(successText, MainPageStore.name);

    this.state = 'COMPLETED';
  }
  onStart() {
    this.state = 'LOADING';
  }
}