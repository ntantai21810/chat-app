import * as React from "react";
import styles from "./style.module.scss";

export interface IInputProps {
  type?: "text" | "number" | "password";
  placeholder?: string;
  label?: string;
  error?: string;
  [key: string]: any;
}

function Input(props: IInputProps, ref: any) {
  const {
    type = "text",
    placeholder = "",
    label = "",
    error,
    ...otherProps
  } = props;

  return (
    <div className={styles.container}>
      <label className={styles.label}>
        <span>{label}</span>
        <input
          className={styles.input}
          type={type}
          placeholder={placeholder}
          ref={ref}
          {...otherProps}
        />
        {error && <span className={styles.error}>{error}</span>}
      </label>
    </div>
  );
}

export default React.forwardRef(Input);
