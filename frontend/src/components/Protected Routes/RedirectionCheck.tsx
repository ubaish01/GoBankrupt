import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const RedirectionCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useSelector((state: any) => state.ROOT);
  useEffect(() => {
    if ((!login || user.onboard) && location.pathname.includes("/user/onboard"))
      navigate("/auth");
    if (login && !user.onboard) navigate("/user/onboard");
  }, [location.pathname, user]);

  return <></>;
};

export default RedirectionCheck;
