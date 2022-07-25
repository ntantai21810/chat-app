import * as React from "react";
import { commonController } from "../../../../bootstrap";
import { IMessageThumb } from "../../../../domains";
import styles from "../../../assets/styles/AutoResizeInput.module.scss";
import PreviewLink from "../PreviewLink";

export interface IAutoResizeInputProps {
  endIcon?: React.ReactNode;
  onChange?: (value: string) => any;
  onSubmit?: (value: string) => any;
  onPaste?: React.ClipboardEventHandler<HTMLSpanElement>;
  value?: string;
  onDrop?: React.DragEventHandler<HTMLInputElement>;
  onThumbDone?: (thumb: IMessageThumb | undefined) => any;
  previewLink?: boolean;
}

const MAX_SIZE = 1000;

function AutoResizeInput(
  props: IAutoResizeInputProps,
  ref: React.MutableRefObject<Partial<HTMLSpanElement>>
) {
  const {
    endIcon,
    onChange,
    onSubmit,
    onPaste,
    value,
    onDrop,
    previewLink = true,
    onThumbDone,
  } = props;

  const [urlMetadata, setUrlMetadata] = React.useState<{
    url: string;
    title: string;
    description: string;
    image: string;
  }>();

  const innerRef = React.useRef<HTMLSpanElement | null>(null);
  const posRef = React.useRef(0);
  const abortControllerRef = React.useRef<AbortController>();

  const handleInput: React.FormEventHandler<HTMLSpanElement> = (e) => {
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

        if (abortControllerRef.current) abortControllerRef.current.abort();

        onChange("");
      }
    }
  };

  const handlePaste: React.ClipboardEventHandler<HTMLSpanElement> = async (
    e
  ) => {
    const data = e.clipboardData.getData("text");

    if (data.length > MAX_SIZE) {
      if (innerRef.current) {
        innerRef.current.innerText = data.substring(0, MAX_SIZE);
      }
      e.preventDefault();
      return;
    }

    if (innerRef.current) {
      e.preventDefault();

      document.execCommand("insertHTML", false, data);
    }

    let url = "";

    if (data) {
      const match = data.match(/\bhttps?:\/\/\S+/i);

      if (match && match[0]) url = match[0];
    }

    if (url) {
      try {
        abortControllerRef.current = new AbortController();

        const thumb = await commonController.previewLink(
          url,

          { signal: abortControllerRef.current.signal }
        );

        setUrlMetadata(thumb);

        if (onThumbDone) onThumbDone(thumb);
      } catch (e) {
        console.log(e);
      }
    }

    if (onPaste) onPaste(e);
  };

  const handleKeypress: React.KeyboardEventHandler = (e) => {
    if (innerRef.current) {
      if (innerRef.current.innerText.length >= MAX_SIZE) e.preventDefault();
    }
  };

  React.useImperativeHandle(ref, () => ({
    oninput: () => (handleInput as any)(),
    reset: () => {
      setUrlMetadata(undefined);
      if (innerRef.current) innerRef.current.innerHTML = "";
      if (onThumbDone) onThumbDone(undefined);
    },
  }));

  React.useEffect(() => {
    const handleValueChange = async () => {
      if (innerRef.current && value !== undefined) {
        innerRef.current.innerHTML = value;

        setCaretPosition(innerRef.current, posRef.current);
      }
    };

    handleValueChange();
  }, [value]);

  React.useEffect(() => {
    posRef.current = getSelectionCharacterOffsetWithin(innerRef.current!).start;
  });

  return (
    <div className={styles.container}>
      {previewLink && urlMetadata && (
        <div className={styles.previewLink}>
          <PreviewLink
            title={urlMetadata.title}
            description={urlMetadata.description}
            image={urlMetadata.image}
            url={urlMetadata.url}
          />
        </div>
      )}
      <div className={styles.input}>
        <span
          className={styles.textarea}
          style={{ paddingRight: !!endIcon ? "5rem" : "" }}
          role="textbox"
          ref={innerRef}
          contentEditable
          onInput={handleInput}
          onPaste={handlePaste}
          onDrop={onDrop}
          onKeyPress={handleKeypress}
          onKeyDown={(e) => {
            if (e.code === "Enter" && onSubmit) {
              onSubmit((innerRef.current as any).innerText);
              setUrlMetadata(undefined);
              if (innerRef.current) innerRef.current.innerText = "";
            }
          }}
        ></span>

        {endIcon && (
          <div
            className={styles.icon}
            onClick={() => {
              if (onSubmit) onSubmit((innerRef.current as any).innerText);
            }}
          >
            {endIcon}
          </div>
        )}
      </div>
    </div>
  );
}

function getSelectionCharacterOffsetWithin(element: any) {
  let start = 0;
  let end = 0;
  let doc = element.ownerDocument || element.document;
  let win = doc.defaultView || doc.parentWindow;
  let sel;
  if (typeof win.getSelection != "undefined") {
    sel = win.getSelection();
    if (sel.rangeCount > 0) {
      let range = win.getSelection().getRangeAt(0);
      let preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.startContainer, range.startOffset);
      start = preCaretRange.toString().length;
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      end = preCaretRange.toString().length;
    }
  } else if ((sel = doc.selection) && sel.type != "Control") {
    let textRange = sel.createRange();
    let preCaretTextRange = doc.body.createTextRange();
    preCaretTextRange.moveToElementText(element);
    preCaretTextRange.setEndPoint("EndToStart", textRange);
    start = preCaretTextRange.text.length;
    preCaretTextRange.setEndPoint("EndToEnd", textRange);
    end = preCaretTextRange.text.length;
  }
  return { start: start, end: end };
}

// Move caret to a specific point in a DOM element
function setCaretPosition(el: any, pos: any) {
  // Loop through all child nodes
  for (var node of el.childNodes) {
    if (node.nodeType == 3) {
      // we have a text node
      if (node.length >= pos) {
        // finally add our range
        var range = document.createRange(),
          sel = window.getSelection();
        range.setStart(node, pos);
        range.collapse(true);
        sel!.removeAllRanges();
        sel!.addRange(range);
        return -1; // we are done
      } else {
        pos -= node.length;
      }
    } else {
      pos = setCaretPosition(node, pos);
      if (pos == -1) {
        return -1; // no need to finish the for loop
      }
    }
  }
  return pos; // needed because of recursion stuff
}

export default React.forwardRef(AutoResizeInput);
