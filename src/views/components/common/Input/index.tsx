import classNames from "classnames";
import * as React from "react";
import styles from "./style.module.scss";

export interface IInputProps {
  type?: "text" | "number" | "password";
  placeholder?: string;
  label?: string;
  error?: boolean;
  helperText?: string;
  border?: boolean;
  name?: string;
  icon?: React.ReactNode;
  onChange?: React.ChangeEventHandler<any>;
  onBlur?: React.FocusEventHandler<any>;
  onSubmit?: () => any;
  value?: string;
}

function Input(props: IInputProps, ref: any) {
  const {
    type = "text",
    placeholder = "",
    label = "",
    error = false,
    helperText = "",
    border = true,
    name,
    icon,
    value,
    onChange,
    onBlur,
    onSubmit,
  } = props;

  return (
    <div className={styles.container}>
      <label className={styles.label}>
        {label && <span>{label}</span>}

        <div className={styles.main}>
          <input
            className={classNames({
              [styles.input]: true,
              [styles.error]: error,
              [styles.border]: border,
            })}
            type={type}
            placeholder={placeholder}
            ref={ref}
            onChange={onChange}
            onBlur={onBlur}
            name={name}
            style={{ paddingRight: !!icon ? "5rem" : "" }}
            value={value}
            onKeyDown={(e) => {
              if (e.code === "Enter" && onSubmit) onSubmit();
            }}
          />

          {icon && (
            <div
              className={styles.icon}
              onClick={() => {
                if (onSubmit) onSubmit();
              }}
            >
              {icon}
            </div>
          )}
        </div>

        {helperText && (
          <span
            className={classNames({
              [styles.helperText]: true,
              [styles.error]: error,
            })}
          >
            {helperText}
          </span>
        )}
      </label>
    </div>
  );
}

export default React.forwardRef(Input);
