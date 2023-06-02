import React from "react";
import { makeAutoObservable } from "mobx";

export class Store {
  constructor() { 
    makeAutoObservable(this) 
  }
}

export const StoreContext = React.createContext(new Store());