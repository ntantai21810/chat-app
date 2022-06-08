import { useNavigate } from "react-router-dom";
import { store } from "../framework/redux/store";

export function useNav() {
  return useNavigate();
}

export function useDispatch() {
  return store.dispatch;
}
