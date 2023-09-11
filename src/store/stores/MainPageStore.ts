import { flow, makeAutoObservable } from "mobx";
import { http, logger } from "../../common/features";
import { LoadStatesType, Optional, Undef } from "../../common/types";
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
  /** состояние загрузки меню */
  state: LoadStatesType = 'INITIAL';
  /** состояние загрузки списка поваров */
  cookstate: LoadStatesType = 'INITIAL';
  /** состояние загрузки отзывов на блюдо */
  otzivistate: LoadStatesType = 'INITIAL';
  /** состояние загрузки отзывов на повара */
  loadCookInfoState: LoadStatesType = 'INITIAL';

  get isLoading() { return this.state === 'LOADING' }
  get cookIsLoading() { return this.cookstate === 'LOADING' }
  get otziviIsLoading() { return this.otzivistate === 'LOADING' }
  rootStore: Store;

  categories: Array<CategoryCourse> = [];
  popular: Array<CourseItem> = [];
  cooks: Array<Cook> = [];

  get allDishes() {
    const result: CourseItem[] = []
    this.categories.forEach(category => 
      category.CourseList.forEach(couse => 
        result.push(couse)
      )
    )
    return result;
  }
  dishSearcher = new Searcher(() => this.allDishes)

  getDishByID(id: number | string) {
    let all: CourseItem[] = []
    this.categories.forEach(cat => 
      cat.CourseList.forEach(dish => 
        all.push(dish)
      )
    )
    return all.find(dish => dish.VCode == id)
  }

  
  constructor(rootStore: Store) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
    this.watchCourse = this.watchCourse.bind(this);
  }

  itemModal = new Modal();
  otziviModal = new Modal();
  watchCockModal = new Modal();
  selectedCock: Optional<Cook> = null;
  selectedCockReviews: CookReviews[] = [];
  
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
    logger.log('Просматриваем блюдо ' + course?.Name, 'Main-Page-Store')
    this.selectedCourse = course;
    this.itemModal.open();
  }

  selectedCourseReviews: CourseOtzyv[] = []
  async watchOtzivi(course: CourseItem) {
    logger.log('Просматриваем отзывы', 'Main-Page-Store')
    this.selectedCourse = course;
    this.loadCourseReviews(course);
    this.otziviModal.open();
  }

  closeWatchOtzivi() {
    this.selectedCourse = null;
    this.selectedCourseReviews = [];
    this.otziviModal.close();
  }

  loadCourseReviews = flow(function* (
    this: MainPageStore,
    { VCode }: CourseItem
  ) {
    try{
      this.otzivistate = 'LOADING';
      this.selectedCourseReviews = []
      const response: Undef<CourseOtzyv[]> = yield http.get(`getCourseRating/${VCode}`);
      if(response?.length) {
        response.forEach(otziv => {
          this.selectedCourseReviews.push(otziv)
        });
      }
      
      this.otzivistate = 'COMPLETED';
    } catch(e) {
      this.otzivistate = 'FAILED';
    }
  })

  loadMenu = flow(function* (
    this: MainPageStore, 
    orgID: number
  ) {
    this.onStart();
    try {
      const data: Undef<V3_userInfoResponse> = yield http.get('/getUserMenu_v3/' + orgID);
      this.categories = [];
      this.popular = [];
      if(data?.BaseMenu && data?.PopularMenu) {
        data.BaseMenu.forEach(category =>
          this.categories.push(category)
        )
        data.PopularMenu.forEach(couse =>
          this.popular.push(couse)
        )
      }
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