import { makeAutoObservable } from "mobx";
import { Store } from "../RootStore";

export class CartStore {
  rootStore: Store
  constructor(rootStore: Store) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  
}