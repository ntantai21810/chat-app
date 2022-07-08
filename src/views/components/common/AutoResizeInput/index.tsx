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

function AutoResizeInput(
  props: IAutoResizeInputProps,
  ref: React.MutableRefObject<Partial<HTMLSpanElement>>
) {
  const { endIcon, onChange, onSubmit, onPaste, value, onDrop } = props;

  const innerRef = React.useRef<HTMLSpanElement | null>(null);

  const handleInput: React.FormEventHandler<HTMLSpanElement> = () => {
    if (onChange) {
      if (innerRef.current) {
        innerRef.current.scrollTop = innerRef.current.scrollHeight;
      }

      //Prevent call onChange after submit
      if (
        typeof (innerRef.current as any).innerText === "string" &&
        (innerRef.current as any).innerText.charCodeAt([
          (innerRef.current as any).innerText.length - 1,
        ]) !== 10
      ) {
        onChange((innerRef.current as any).innerText);
      }

      //Clear input after enter
      if (
        (innerRef.current as any).innerText.charCodeAt([
          (innerRef.current as any).innerText.length - 1,
        ]) === 10 &&
        innerRef.current
      ) {
        innerRef.current.innerText = "";

        onChange("");
      }
    }
  };

  React.useImperativeHandle(ref, () => ({
    oninput: () => (handleInput as any)(),
  }));

  React.useEffect(() => {
    if (innerRef.current && value !== undefined) {
      innerRef.current.innerHTML = value;

      placeCaretAtEnd(innerRef.current);
    }
  }, [value]);

  return (
    <div className={styles.container}>
      <span
        className={styles.textarea}
        style={{ paddingRight: !!endIcon ? "5rem" : "" }}
        role="textbox"
        ref={innerRef}
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

export default React.forwardRef(AutoResizeInput);
