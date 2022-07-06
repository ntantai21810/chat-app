import * as React from "react";
import styles from "../../../assets/styles/AutoResizeInput.module.scss";

export interface IAutoResizeInputProps {
  endIcon?: React.ReactNode;
  onChange?: (value: string) => any;
  onSubmit?: Function;
  onPaste?: React.ClipboardEventHandler<HTMLSpanElement>;
  value?: string;
  onDrop?: React.DragEventHandler<HTMLInputElement>;
}

export default function AutoResizeInput(props: IAutoResizeInputProps) {
  const { endIcon, onChange, onSubmit, onPaste, value, onDrop } = props;

  const ref = React.useRef<HTMLSpanElement | null>(null);

  const handleInput: React.FormEventHandler<HTMLSpanElement> = (e) => {
    if (onChange) {
      //Prevent call onChange after submit
      if (
        typeof (e.target as any).innerText === "string" &&
        (e.target as any).innerText.charCodeAt([
          (e.target as any).innerText.length - 1,
        ]) !== 10
      ) {
        onChange((e.target as any).innerText);
      }

      //Clear input after enter
      if (
        (e.target as any).innerText.charCodeAt([
          (e.target as any).innerText.length - 1,
        ]) === 10 &&
        ref.current
      ) {
        ref.current.innerText = "";

        onChange("");
      }
    }
  };

  React.useEffect(() => {
    if (ref.current && value) {
      ref.current.innerHTML = value;

      placeCaretAtEnd(ref.current);
    }
  }, [value]);

  return (
    <div className={styles.container}>
      <span
        className={styles.textarea}
        style={{ paddingRight: !!endIcon ? "5rem" : "" }}
        role="textbox"
        ref={ref}
        contentEditable
        onInput={handleInput}
        onPaste={onPaste}
        onDrop={onDrop}
        onKeyDown={(e) => {
          if (e.code === "Enter" && onSubmit) onSubmit();
        }}
      ></span>

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
  );
}

function placeCaretAtEnd(el: HTMLElement) {
  el.focus();

  if (
    typeof window.getSelection != "undefined" &&
    typeof document.createRange != "undefined"
  ) {
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);

    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  } else if (typeof (document.body as any).createTextRange != "undefined") {
    const textRange = (document.body as any).createTextRange();
    textRange.moveToElementText(el);
    textRange.collapse(false);
    textRange.select();
  }
}
