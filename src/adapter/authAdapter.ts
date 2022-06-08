import { useAppSelector } from "../framework/redux/hook";

export function useAuth() {
  return useAppSelector((state) => state.auth);
}
