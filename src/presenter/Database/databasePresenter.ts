import { getDispatch } from "../../adapter/frameworkAdapter";
import { setDatabaseConnect } from "../../framework/redux";
import { IDatabasePresenter } from "./IDatabasePresenter";

export class DatabasePresenter implements IDatabasePresenter {
  private dispatch;

  constructor() {
    this.dispatch = getDispatch();
  }

  setConnect(isConnected: boolean): void {
    this.dispatch(setDatabaseConnect(isConnected));
  }
}
