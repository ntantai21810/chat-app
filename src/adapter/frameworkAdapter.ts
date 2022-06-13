import { store } from "../framework/redux/store";

export function getDispatch() {
  return store.dispatch;
}
