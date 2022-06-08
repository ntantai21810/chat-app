import * as React from "react";
import { useNav } from "../../../adapter/frameworkAdapter";

export interface IMainPageProps {}

export default function MainPage(props: IMainPageProps) {
  const navigate = useNav();

  React.useEffect(() => {
    navigate("/login");
  }, [navigate]);

  return <div>Main page</div>;
}
