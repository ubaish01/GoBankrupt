import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const LoginOnly = () => {
  const { login } = useSelector((state: any) => state.ROOT);

  return login ? <Outlet /> : <Navigate to="/auth" />;
};

export default LoginOnly;
