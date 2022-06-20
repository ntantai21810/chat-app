import * as React from "react";
import styles from "./style.module.scss";
import { BsImage } from "react-icons/bs";

export interface IConversationActionProps {
  onFileChange: (files: string[]) => void;
}

export default function ConversationAction(props: IConversationActionProps) {
  const { onFileChange } = props;

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files) return;

    const files: string[] = [];
    let numberOfLoadedFiles = 0;

    for (let i = 0; i < e.target.files.length; i++) {
      const reader = new FileReader();

      const file = e.target.files[i];

      reader.readAsDataURL(file);

      reader.onload = function () {
        numberOfLoadedFiles++;

        if (
          reader.result &&
          typeof reader.result === "string" &&
          file.type.startsWith("image/")
        ) {
          files.push(reader.result);
        }

        if (numberOfLoadedFiles === e.target.files!.length) onFileChange(files);
      };

      reader.onerror = function (error) {
        console.log("Error: ", error);

        numberOfLoadedFiles++;

        if (numberOfLoadedFiles === e.target.files!.length) onFileChange(files);
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
        />
      </div>
    </div>
  );
}
