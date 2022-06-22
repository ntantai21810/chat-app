import { selectAllConversation } from "../framework/redux/conversation";
import { selectAllFriends } from "../framework/redux/friend";
import { useAppSelector } from "../framework/redux/hook";
import { selectAllMessages } from "../framework/redux/message";

export function useAuth() {
  return useAppSelector((state) => state.auth);
}

export function useConversation() {
  return useAppSelector(selectAllConversation);
}

export function useMessage() {
  return useAppSelector(selectAllMessages);
}

export function useCommon() {
  return useAppSelector((state) => state.common);
}

export function useFriends() {
  return useAppSelector(selectAllFriends);
}
