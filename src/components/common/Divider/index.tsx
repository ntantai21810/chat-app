import * as React from "react";

export interface IDividerProps {
  color?: string;
  width?: string;
  margin?: string;
}

export default function Divider(props: IDividerProps) {
  const { color, width = "1px", margin = "" } = props;

  return (
    <div
      style={{
        backgroundColor: color || "#0d6efd",
        height: width,
        margin: margin,
      }}
    ></div>
  );
}
