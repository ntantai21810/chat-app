import * as React from "react";
import styles from "../../../assets/styles/Banner.module.scss";
import BannerPng from "../../../assets/images/Banner.png";

export interface IBannerProps {}

export default function Banner(props: IBannerProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        Chào mừng đến với <span>Zalo PC!</span>
      </h2>
      <p className={styles.description}>
        Khám phá những tiện ích hỗ trợ làm việc và trò chuyện cùng người thân,
        bạn bè được tối ưu hoá cho máy tính của bạn.
      </p>

      <div className={styles.imgContainer}>
        <img className={styles.img} src={BannerPng} alt="Chat app banner" />
      </div>
    </div>
  );
}
