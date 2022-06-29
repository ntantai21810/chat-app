import classNames from "classnames";
import * as React from "react";
import styles from "../../../assets/styles/Dropdown.module.scss";

export interface IDropdownProps {
  children: React.ReactNode;
  dropdown: React.ReactNode;
  position?: "top" | "left" | "right" | "bottom";
}

export default function Dropdown(props: IDropdownProps) {
  const { children, dropdown, position = "bottom" } = props;
  const [showDropdown, setShowDropdown] = React.useState(false);

  const dropdownRef = React.useRef<HTMLDivElement | null>(null);
  const childrenRef = React.useRef<HTMLDivElement | null>(null);

  const handleClick = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as any) &&
      childrenRef.current &&
      !childrenRef.current.contains(event.target as any)
    ) {
      setShowDropdown(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownRef, childrenRef]);

  return (
    <div className={styles.dropdown}>
      <div onClick={() => setShowDropdown((state) => !state)} ref={childrenRef}>
        {children}
      </div>
      {showDropdown && (
        <div
          className={classNames({
            [styles.dropdown]: true,
            [styles.top]: position === "top",
            [styles.left]: position === "left",
            [styles.bottom]: position === "bottom",
            [styles.right]: position === "right",
          })}
          ref={dropdownRef}
        >
          {dropdown}
        </div>
      )}
    </div>
  );
}
