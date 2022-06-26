import * as React from "react";
import styles from "./style.module.scss";
import { BsImage } from "react-icons/bs";
import { GrAttachment } from "react-icons/gr";
import { IFile } from "../../../domains/common/helper";

export interface IConversationActionProps {
  onFileChange: (files: IFile[]) => void;
}

export default function ConversationAction(props: IConversationActionProps) {
  const { onFileChange } = props;
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files) return;

    const files: IFile[] = [];
    let numberOfLoadedFiles = 0;
    let totalSize = 0;
    let isOverSize = false;

    for (let i = 0; i < e.target.files.length; i++) {
      if (isOverSize) return;

      const reader = new FileReader();

      const file = e.target.files[i];

      reader.readAsDataURL(file);

      reader.onload = function () {
        numberOfLoadedFiles++;

        if (
          reader.result &&
          typeof reader.result === "string" &&
          (file.type.startsWith("image/") ||
            ["application/pdf", "text/plain"].includes(file.type))
        ) {
          totalSize += file.size;

          if (totalSize > 5000000) {
            isOverSize = true;
            if (inputRef.current) inputRef.current.value = "";
            return;
          }

          files.push({
            name: file.name,
            size: file.size,
            type: file.type,
            data: reader.result,
          });
        }

        if (numberOfLoadedFiles === e.target.files!.length) {
          onFileChange(files);

          if (inputRef.current) inputRef.current.value = "";
        }
      };

      reader.onerror = function (error) {
        console.log("Error: ", error);

        numberOfLoadedFiles++;

        if (numberOfLoadedFiles === e.target.files!.length) {
          onFileChange(files);

          if (inputRef.current) inputRef.current.value = "";
        }
      };
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.action}>
        <BsImage fontSize="2.2rem" />
        <input
          className={styles.input}
          type="file"
          multiple
          onChange={handleFileChange}
          ref={inputRef}
          accept="image/png, image/gif, image/jpeg"
        />
      </div>
      <div className={styles.action}>
        <GrAttachment fontSize="2.2rem" />
        <input
          className={styles.input}
          type="file"
          multiple
          onChange={handleFileChange}
          ref={inputRef}
          accept="application/pdf, text/plain"
        />
      </div>
    </div>
  );
}
