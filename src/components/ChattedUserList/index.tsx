import * as React from "react";
import ChattedUserItem from "../ChattedUserItem";

export interface IChattedUserListProps {}

export default function ChattedUserList(props: IChattedUserListProps) {
  return (
    <>
      <ChattedUserItem />
      <ChattedUserItem />
      <ChattedUserItem />
      <ChattedUserItem />
      <ChattedUserItem />
      <ChattedUserItem />
    </>
  );
}
