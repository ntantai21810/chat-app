import { useAppSelector } from "../framework/redux/hook";

export function useConversation() {
  return useAppSelector((state) => state.conversation);
}
