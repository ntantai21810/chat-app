import * as React from "react";
import VerticalHeader, {
  VerticalHeaderWidth,
} from "../../views/components/common/Header/VerticalHeader";

export interface IMainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout(props: IMainLayoutProps) {
  const { children } = props;

  return (
    <>
      <VerticalHeader />

      <div style={{ marginLeft: VerticalHeaderWidth }}>{children}</div>
    </>
  );
}
