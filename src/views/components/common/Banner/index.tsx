import * as React from "react";
import styles from "./style.module.scss";

export interface IBannerProps {}

export default function Banner(props: IBannerProps) {
  return (
    <div>
      <h2>Chào mừng đến với Zalo PC!</h2>
      <p>
        Khám phá những tiện ích hỗ trợ làm việc và trò chuyện cùng người thân,
        bạn bè được tối ưu hoá cho máy tính của bạn.
      </p>
    </div>
  );
}
