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

export class Searcher {
  _result: Array<any> = []
  _inputDataGetter: () => Array<any>

  get isSearching() {
    return Boolean(this.searchTerm.length)
  }

  constructor(inputGetter: () => Array<any>) {
    this._inputDataGetter = inputGetter;
    this._result = this._inputDataGetter();
    makeAutoObservable(this);
  }

  searchTerm = ''
  search(term: string) {
    this.searchTerm = term;
    const data = this._inputDataGetter()
    if (!this.isSearching) {
      this._result = data;
    } else {
      this._result = data.filter((d) => {
        const bools = Object.keys(d).map((key) => {
          if (typeof d[key] === 'string') {
            return d[key]
              .toLowerCase()
              .includes(this.searchTerm.toLowerCase()) || false;
          } else {
            return false
          }
        })
        return bools.includes(true);
      })
    }

  }
  get result() {
    return this._result
  }
}

export class MainPageStore {
  state: LoadStatesType = LoadStates.INITIAL;
  cookstate: LoadStatesType = LoadStates.INITIAL;
  rootStore: Store;

  categories: Array<CategoryCourse> = [];
  cooks: Array<Cook> = [];

  get allDishes() {
    const result: CourseItem[] = []
    this.categories.forEach((category) => 
      category.CourseList.forEach((couse) => 
        result.push(couse)
      )
    )
    return result;
  }
  dishSearcher = new Searcher(() => this.allDishes)

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
  get cookIsLoading() {
    return this.cookstate === LoadStates.LOADING
  }
  constructor(rootStore: Store) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
    this.watchCourse = this.watchCourse.bind(this);
  }

  itemModal = new Modal();
  watchCockModal = new Modal();
  selectedCock: Optional<Cook> = null;
  selectedCockReviews: CookReviews[] = [];
  loadCookInfoState: LoadStatesType = 'INITIAL';
  async watchCook(cook: Cook) {
    this.selectedCock = cook;
    this.loadCookReviews(cook);
    this.watchCockModal.open();
  }
  async closeCookWatch() {
    this.selectedCock = null;
    this.selectedCockReviews = [];
    this.watchCockModal.close();
  }

  loadCookReviews = flow(function* (
    this: MainPageStore,
    cook: Cook
  ) {
    const point = this.rootStore.userStore.currentOrg;
    try{
      this.loadCookInfoState = 'LOADING';
      this.selectedCockReviews = []
      const response = yield http.get(`getShopInfo/${point}/${cook.UserId}`);
      response.forEach((element: any) => {
        this.selectedCockReviews.push(element)
      });
      this.loadCookInfoState = 'COMPLETED';
    } catch(e) {
      this.loadCookInfoState = 'FAILED';
    }
  })

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

  loadMenu = flow(function* (
    this: MainPageStore, 
    orgID: number
  ) {
    this.onStart();
    try {
      const data: Array<CategoryCourse> = yield http.get('/getUserMenu_v2/' + orgID);
      this.categories = [];
      data.forEach((category) =>
        this.categories.push(category)
      )
      this.onSuccess();
    } catch (err) {
      this.onFailure(err)
    }
  })

  loadCooks = flow(function* (
    this: MainPageStore,
    orgId: number
  ) {
    this.cookstate = 'LOADING'
    try {
      const data: [Cook[]] = yield http.get('/getShopInfo/' + orgId);
      this.cooks = [];
      data[0]?.forEach((cock) =>
        this.cooks.push(cock)
      )
      this.cookstate = 'COMPLETED'
    } catch (err) {
      this.cookstate = 'FAILED';
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