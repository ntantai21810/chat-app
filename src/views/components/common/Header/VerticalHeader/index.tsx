import classNames from "classnames";
import { AiFillSetting } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import { getDispatch } from "../../../../../adapter/frameworkAdapter";
import {
  authController,
  databaseController,
  socketController,
} from "../../../../../bootstrap";
import { resetCommon } from "../../../../../framework/redux/common";
import { removeAllConversation } from "../../../../../framework/redux/conversation";
import { removeAllFriend } from "../../../../../framework/redux/friend";
import { removeAllMessage } from "../../../../../framework/redux/message";
import Avatar from "../../Avatar";
import Dropdown from "../../Dropdown";
import routes from "../routes";
import styles from "../../../../assets/styles/VerticalHeader.module.scss";

export interface IVerticalHeaderProps {}

export const VerticalHeaderWidth = "8rem";

export default function VerticalHeader(props: IVerticalHeaderProps) {
  const location = useLocation();
  const dispatch = getDispatch();

  const pathName = location.pathname;

  const handleLogoutClick = () => {
    authController.logout();
    socketController.disconnect();
    databaseController.disconnect();

    dispatch(removeAllMessage());
    dispatch(removeAllConversation());
    dispatch(removeAllFriend());
    dispatch(resetCommon());
  };

  const handleCloseClick = () => {
    (window as any).electronAPI.closeApp();
  };

  return (
    <div className={styles.header} style={{ width: VerticalHeaderWidth }}>
      <div className={styles.avatarContainer}>
        <Avatar
          width="6rem"
          hegiht="6rem"
          src="https://images.unsplash.com/photo-1644982648791-a010e61aa845?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170"
          alt="Chat app logo"
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
        <Dropdown
          dropdown={
            <div className={styles.settings}>
              <ul>
                <li className={styles.danger} onClick={handleLogoutClick}>
                  Đăng xuất
                </li>
                <li onClick={handleCloseClick}>Thoát</li>
              </ul>
            </div>
          }
          position="top"
        >
          <li className={styles.navItem}>
            <AiFillSetting color="#fff" />
          </li>
        </Dropdown>
      </ul>
    </div>
  );
}
