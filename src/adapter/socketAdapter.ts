import { useAppSelector } from "../framework/redux/hook";

export function useSocket() {
  return useAppSelector((state) => state.socket);
}
