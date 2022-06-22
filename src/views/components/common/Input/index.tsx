import classNames from "classnames";
import * as React from "react";
import styles from "./style.module.scss";
import { BiError } from "react-icons/bi";

export interface IInputProps {
  type?: "text" | "number" | "password";
  placeholder?: string;
  label?: string;
  error?: boolean;
  helperText?: string;
  border?: boolean;
  name?: string;
  endIcon?: React.ReactNode;
  onChange?: React.ChangeEventHandler<any>;
  onBlur?: React.FocusEventHandler<any>;
  onSubmit?: Function;
  onPaste?: React.ClipboardEventHandler<HTMLInputElement>;
  value?: string;
  className?: string;
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
    endIcon,
    value,
    onChange,
    onBlur,
    onSubmit,
    onPaste,
    className = "",
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
              [className]: true,
            })}
            type={type}
            placeholder={placeholder}
            ref={ref}
            onChange={onChange}
            onBlur={onBlur}
            name={name}
            style={{ paddingRight: !!endIcon ? "5rem" : "" }}
            value={value}
            onKeyDown={(e) => {
              if (e.code === "Enter" && onSubmit) onSubmit();
            }}
            onPaste={onPaste}
          />

          {endIcon && (
            <div
              className={styles.icon}
              onClick={() => {
                if (onSubmit) onSubmit();
              }}
            >
              {endIcon}
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
            {error && (
              <div className={styles.icon}>
                <BiError />
              </div>
            )}
            {helperText}
          </span>
        )}
      </label>
    </div>
  );
}

export default React.forwardRef(Input);
