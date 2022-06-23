import * as React from "react";
import { useNavigate } from "react-router-dom";

export interface IMainPageProps {}

export default function MainPage(props: IMainPageProps) {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate("/chat");
  }, [navigate]);

  return <div></div>;
}
