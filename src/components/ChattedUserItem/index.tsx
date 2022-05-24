import classNames from "classnames";
import * as React from "react";
import Avatar from "../common/Avatar";
import styles from "./style.module.scss";

export interface IChattedUserItemProps {}

export default function ChattedUserItem(props: IChattedUserItemProps) {
  return (
    <div
      className={classNames({
        [styles.container]: true,
        [styles.active]: false, //active
      })}
    >
      <div>
        <Avatar
          src="https://images.unsplash.com/photo-1653257340129-148be674836c?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=465"
          alt="User avatar"
          width="5.6rem"
          hegiht="5.6rem"
        />
      </div>

      <div className={styles.right}>
        <div className={styles.header}>
          <p className={styles.title}>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cupiditate
            consequatur doloremque quam ipsam facilis, minus inventore
            distinctio ut commodi provident nam quidem eum. Placeat dicta
            provident dignissimos fuga architecto dolorem.
          </p>

          <p className={styles.time}>20 gio</p>
        </div>

        <p className={styles.message}>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatum
          illo molestias voluptates maiores? Dignissimos nulla tempora sit ut
          ipsam facere similique odit facilis voluptate doloribus,
          necessitatibus, natus quod, explicabo fuga.
        </p>
      </div>
    </div>
  );
}
