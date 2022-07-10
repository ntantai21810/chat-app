import classNames from "classnames";
import * as React from "react";
import styles from "../../../assets/styles/Button.module.scss";

export interface IButtonProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => any;
}

export default function Button(props: IButtonProps) {
  const { children, fullWidth, type, disabled, icon, onClick } = props;

  return (
    <button
      disabled={disabled}
      className={classNames({
        [styles.btn]: true,
        [styles.fullWidth]: fullWidth,
        [styles.disabled]: !!disabled,
      })}
      type={type}
      onClick={onClick}
    >
      {icon && <div className={styles.icon}>{icon}</div>}
      {children}
    </button>
  );
}
