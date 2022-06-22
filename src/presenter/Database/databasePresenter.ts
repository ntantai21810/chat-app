import { getDispatch } from "../../adapter/frameworkAdapter";
import { setDatabaseConnect } from "../../framework/redux/common";
import { IDatabasePresenter } from "./IDatabasePresenter";

export default class DatabasePresenter implements IDatabasePresenter {
  private dispatch;

  constructor() {
    this.dispatch = getDispatch();
  }

  setConnect(isConnected: boolean): void {
    this.dispatch(setDatabaseConnect(isConnected));
  }
}
