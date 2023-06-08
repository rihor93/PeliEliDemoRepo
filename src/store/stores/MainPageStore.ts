import { flow, makeAutoObservable } from "mobx";
import { http, logger } from "../../common/features";
import { LoadStates, LoadStatesType, Optional } from "../../common/types";
import { Store } from "../RootStore";

export class MainPageStore {
  state: LoadStatesType = LoadStates.INITIAL;
  rootStore: Store;

  categories: Array<CategoryCourse> = [];

  constructor(rootStore: Store) {
    this.rootStore = rootStore;
    makeAutoObservable(this)
  }

  /** категория блюд которая видна на экране */
  visibleCategory: Optional<string> = null;
  setVisibleCategory(categoryId: Optional<string>) {
    this.visibleCategory = categoryId;
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

  category_courses: Array<{
    id: string,
    category: string,
    courses: Array<{
      img: string,
      title: string,
      subtitle: string,
      price: string,
    }>,
  }> = [
      {
        id: 'Combo',
        category: 'Комбо',
        courses: [
          {
            img: './gurmag.png',
            title: 'Сигареты жвачки',
            subtitle: 'assasasasa',
            price: '100$'
          },
          {
            img: './gurmag.png',
            title: 'As asss ass',
            subtitle: 'ASsdsdsd',
            price: '123$'
          },
          {
            img: './gurmag.png',
            title: 'asdadsds',
            subtitle: 'asdsdasd',
            price: '100$'
          },
          {
            img: './gurmag.png',
            title: 'As asss ass',
            subtitle: 'ASsdsdsd',
            price: '123$'
          },
          {
            img: './gurmag.png',
            title: 'asdadsds',
            subtitle: 'asdsdasd',
            price: '100$'
          },
          {
            img: './gurmag.png',
            title: 'As asss ass',
            subtitle: 'ASsdsdsd',
            price: '123$'
          },
          {
            img: './gurmag.png',
            title: 'asdadsds',
            subtitle: 'asdsdasd',
            price: '100$'
          },
          {
            img: './gurmag.png',
            title: 'As asss ass',
            subtitle: 'ASsdsdsd',
            price: '123$'
          },
          {
            img: './gurmag.png',
            title: 'asdadsds',
            subtitle: 'asdsdasd',
            price: '100$'
          },
          {
            img: './gurmag.png',
            title: 'As asss ass',
            subtitle: 'ASsdsdsd',
            price: '123$'
          },
          {
            img: './gurmag.png',
            title: 'asdadsds',
            subtitle: 'asdsdasd',
            price: '100$'
          },
          {
            img: './gurmag.png',
            title: 'As asss ass',
            subtitle: 'ASsdsdsd',
            price: '123$'
          },
        ]
      },
      {
        id: 'Pizza',
        category: 'Пицца',
        courses: [
          {
            img: './gurmag.png',
            title: 'Вишневая пицца',
            subtitle: 'asdsdasd',
            price: '100$'
          },
          {
            img: './gurmag.png',
            title: 'Ананасовая пицца',
            subtitle: 'ASsdsdsd',
            price: '123$'
          },
          {
            img: './gurmag.png',
            title: 'Арбузная пицца',
            subtitle: 'asdsdasd',
            price: '100$'
          },
          {
            img: './gurmag.png',
            title: 'итальянская пицца',
            subtitle: 'ASsdsdsd',
            price: '123$'
          },
          {
            img: './gurmag.png',
            title: 'Китайская пицца',
            subtitle: 'asdsdasd',
            price: '100$'
          },
          {
            img: './gurmag.png',
            title: 'Лапша',
            subtitle: 'ASsdsdsd',
            price: '123$'
          },
          {
            img: './gurmag.png',
            title: 'Бульон',
            subtitle: 'asdsdasd',
            price: '100$'
          },
          {
            img: './gurmag.png',
            title: 'Жареная еда',
            subtitle: 'ASsdsdsd',
            price: '123$'
          },
          {
            img: './gurmag.png',
            title: 'Тушеный кабачок',
            subtitle: 'asdsdasd',
            price: '100$'
          },
          {
            img: './gurmag.png',
            title: 'Суп из бычков',
            subtitle: 'ASsdsdsd',
            price: '123$'
          },
          {
            img: './gurmag.png',
            title: 'Шаурма',
            subtitle: 'asdsdasd',
            price: '100$'
          },
          {
            img: './gurmag.png',
            title: 'As asss ass',
            subtitle: 'ASsdsdsd',
            price: '123$'
          },
        ]
      },
      {
        id: 'Dreenk',
        category: 'Напитки',
        courses: [
          {
            img: './gurmag.png',
            title: 'asdadsds',
            subtitle: 'asdsdasd',
            price: '100$'
          },
          {
            img: './gurmag.png',
            title: 'As asss ass',
            subtitle: 'ASsdsdsd',
            price: '123$'
          },
          {
            img: './gurmag.png',
            title: 'asdadsds',
            subtitle: 'asdsdasd',
            price: '100$'
          },
          {
            img: './gurmag.png',
            title: 'As asss ass',
            subtitle: 'ASsdsdsd',
            price: '123$'
          },
          {
            img: './gurmag.png',
            title: 'asdadsds',
            subtitle: 'asdsdasd',
            price: '100$'
          },
          {
            img: './gurmag.png',
            title: 'As asss ass',
            subtitle: 'ASsdsdsd',
            price: '123$'
          },
          {
            img: './gurmag.png',
            title: 'asdadsds',
            subtitle: 'asdsdasd',
            price: '100$'
          },
          {
            img: './gurmag.png',
            title: 'As asss ass',
            subtitle: 'ASsdsdsd',
            price: '123$'
          },
          {
            img: './gurmag.png',
            title: 'asdadsds',
            subtitle: 'asdsdasd',
            price: '100$'
          },
          {
            img: './gurmag.png',
            title: 'As asss ass',
            subtitle: 'ASsdsdsd',
            price: '123$'
          },
          {
            img: './gurmag.png',
            title: 'asdadsds',
            subtitle: 'asdsdasd',
            price: '100$'
          },
          {
            img: './gurmag.png',
            title: 'As asss ass',
            subtitle: 'ASsdsdsd',
            price: '123$'
          },
        ]
      },
    ]


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