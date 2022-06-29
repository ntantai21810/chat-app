import * as React from "react";
import { VscLoading } from "react-icons/vsc";
import styles from "../../../assets/styles/LoadingIcon.module.scss";

export interface ILoadingIconProps {}

export default function LoadingIcon(props: ILoadingIconProps) {
  return <VscLoading className={styles.icon} />;
}
