import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const NotLoginUserOnly = () => {
  const { login } = useSelector((state: any) => state.ROOT);

  return login ? <Navigate to="/" /> : <Outlet />;
};

export default NotLoginUserOnly;
