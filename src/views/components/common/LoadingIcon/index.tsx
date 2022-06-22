import * as React from "react";
import { VscLoading } from "react-icons/vsc";
import styles from "./style.module.scss";

export interface ILoadingIconProps {}

export default function LoadingIcon(props: ILoadingIconProps) {
  return <VscLoading className={styles.icon} />;
}
