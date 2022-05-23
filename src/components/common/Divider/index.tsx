import * as React from "react";
import styles from "./style.module.scss";
import "../../../assets/styles/color.scss";

export interface IDividerProps {
  color?: string;
  width?: string;
  margin?: string;
}

export default function Divider(props: IDividerProps) {
  const { color, width = "1px", margin = "" } = props;

  return (
    <div
      style={{
        backgroundColor: color || "#0d6efd",
        height: width,
        margin: margin,
      }}
      className={styles.divider}
    ></div>
  );
}
