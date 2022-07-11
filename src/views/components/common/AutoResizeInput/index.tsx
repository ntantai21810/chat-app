import * as React from "react";
import { API } from "../../../../network";
import styles from "../../../assets/styles/AutoResizeInput.module.scss";
import PreviewLink from "../PreviewLink";

export interface IAutoResizeInputProps {
  endIcon?: React.ReactNode;
  onChange?: (value: string) => any;
  onSubmit?: Function;
  onPaste?: React.ClipboardEventHandler<HTMLSpanElement>;
  value?: string;
  onDrop?: React.DragEventHandler<HTMLInputElement>;
  previewLink?: boolean;
}

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
  } = props;

  const [urlMetadata, setUrlMetadata] = React.useState<{
    url: string;
    title: string;
    description: string;
    image: string;
  }>();

  const innerRef = React.useRef<HTMLSpanElement | null>(null);
  const posRef = React.useRef(0);

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
    const handleValueChange = async () => {
      if (innerRef.current && value !== undefined) {
        innerRef.current.innerHTML = value;

        setCaretPosition(innerRef.current, posRef.current);

        const urlNode = innerRef.current.querySelector(".url");

        if (urlNode) {
          const url = (urlNode as any).dataset?.url;

          if (url && !urlMetadata) {
            try {
              const metadata = await API.getIntance().get("/preview-link", {
                url,
              });

              setUrlMetadata(metadata);
            } catch (e) {
              console.log(e);
            }
          }
        }
      }
    };

    handleValueChange();
  }, [value]);

  React.useEffect(() => {
    if (innerRef.current && innerRef.current.innerHTML === "") {
      setUrlMetadata(undefined);
    }
  });

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
