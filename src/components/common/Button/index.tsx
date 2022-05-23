import classNames from "classnames";
import * as React from "react";
import styles from "./style.module.scss";

export interface IButtonProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
  [key: string]: any;
}

export default function Button(props: IButtonProps) {
  const { children, fullWidth, type, ...otherProps } = props;

  return (
    <button
      className={classNames({
        [styles.btn]: true,
        [styles.fullWidth]: fullWidth,
      })}
      type={type}
      {...otherProps}
    >
      {children}
    </button>
  );
}