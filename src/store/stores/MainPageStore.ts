import { makeAutoObservable } from "mobx";
import { Optional } from "../../common/types";
import { Store } from "../RootStore";

export class MainPageStore {
  rootStore: Store;

  constructor(rootStore: Store) {
    this.rootStore = rootStore; 
    makeAutoObservable(this) 
  }

  /** категория блюд которая видна на экране */
  visibleCategory: Optional<string> = null;
  setVisibleCategory(categoryId: Optional<string>) {
    this.visibleCategory = categoryId;
  }

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
}