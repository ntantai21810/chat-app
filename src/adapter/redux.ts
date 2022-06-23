import { selectAllConversation } from "../framework/redux/conversation";
import { selectAllFriends } from "../framework/redux/friend";
import { useAppSelector } from "../framework/redux/hook";

export function useAuth() {
  return useAppSelector((state) => state.auth);
}

export function useConversation() {
  return useAppSelector(selectAllConversation);
}

export function useMessage() {
  return useAppSelector((state) => state.message);
}

export function useCommon() {
  return useAppSelector((state) => state.common);
}

export function useFriends() {
  return useAppSelector(selectAllFriends);
}
