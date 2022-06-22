import { getDispatch } from "../../adapter/frameworkAdapter";
import { setSocketConnect } from "../../framework/redux/common";
import { ISocketPresenter } from "./ISocketPresenter";

export default class SocketPresenter implements ISocketPresenter {
  private dispatch;

  constructor() {
    this.dispatch = getDispatch();
  }

  setConnect(isConnected: boolean): void {
    this.dispatch(setSocketConnect(isConnected));
  }
}
