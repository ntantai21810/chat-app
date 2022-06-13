import { useAppSelector } from "../framework/redux/hook";
import { selectAllOnlineUsers } from "../framework/redux/onlineUser";

export function useAuth() {
  return useAppSelector((state) => state.auth);
}

export function useConversation() {
  return useAppSelector((state) => state.conversation);
}

export function useMessage() {
  return useAppSelector((state) => state.message);
}

export function useOnlineUser() {
  return useAppSelector(selectAllOnlineUsers);
}
