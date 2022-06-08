import { useAppSelector } from "../framework/redux/hook";

export function useMessage() {
  return useAppSelector((state) => state.message);
}
