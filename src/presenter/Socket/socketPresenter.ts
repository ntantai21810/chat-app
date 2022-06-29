import { getDispatch } from "../../adapter/frameworkAdapter";
import { setSocketConnect } from "../../framework/redux";
import { ISocketPresenter } from "./ISocketPresenter";

export class SocketPresenter implements ISocketPresenter {
  private dispatch;

  constructor() {
    this.dispatch = getDispatch();
  }

  setConnect(isConnected: boolean): void {
    this.dispatch(setSocketConnect(isConnected));
  }
}
