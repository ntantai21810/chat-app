import { store } from "../framework/redux";

export function getDispatch() {
  return store.dispatch;
}
