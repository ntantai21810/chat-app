import classNames from "classnames";
import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import routes from "../routes";
import styles from "./style.module.scss";
import { AiFillSetting } from "react-icons/ai";

export interface IVerticalHeaderProps {}

export const VerticalHeaderWidth = "8rem";

export default function VerticalHeader(props: IVerticalHeaderProps) {
  const location = useLocation();

  const pathName = location.pathname;

  return (
    <div className={styles.header} style={{ width: VerticalHeaderWidth }}>
      <div className={styles.logoContainer}>
        <img
          src={
            "https://images.unsplash.com/photo-1644982648791-a010e61aa845?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170"
          }
          alt="Chat app logo"
          className={styles.logo}
        />
      </div>

      <ul className={styles.nav}>
        {routes.map((route, index) => (
          <li
            key={index}
            className={classNames({
              [styles.navItem]: true,
              [styles.active]: route.to === pathName,
            })}
          >
            <Link to={route.to}>{route.icon}</Link>
          </li>
        ))}
      </ul>

      <ul className={`${styles.nav} ${styles.mtAuto}`}>
        <li className={styles.navItem}>
          <Link to="#">
            <AiFillSetting color="#fff" />
          </Link>
        </li>
      </ul>
    </div>
  );
}
