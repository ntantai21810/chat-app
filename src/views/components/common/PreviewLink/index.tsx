import * as React from "react";
import styles from "../../../assets/styles/PreviewLink.module.scss";

export interface IPreviewLinkProps {
  image: string;
  title: string;
  description: string;
  url: string;
  onClick?: (url: string) => any;
  onUrlClick?: (url: string) => any;
}

export default function PreviewLink(props: IPreviewLinkProps) {
  const { image, title, description, url, onUrlClick, onClick } = props;

  return (
    <div
      className={styles.container}
      onClick={() => (onClick ? onClick(url) : "")}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div className={styles.imgContainer}>
        <img src={image} alt="Website preview" />
      </div>
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        <p className={styles.description}>{description}</p>
        <p
          className={styles.url}
          onClick={() => (onUrlClick ? onUrlClick(url) : "")}
          style={{ cursor: onUrlClick ? "pointer" : "default" }}
        >
          {url}
        </p>
      </div>
    </div>
  );
}
