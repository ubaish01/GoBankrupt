import { useDispatch } from "react-redux";
import { postRequest } from "../services/Request";
import { AUTH } from "../services/URL";
import {
  login as setLogin,
  user as setUser,
  timerActive,
  wallet,
} from "../redux/user/userSlice";
import { AUTH_STATE } from "../game/constants";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const useAuth = (setState: any) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const register = async (
    data: {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
    },
    e: any
  ) => {
    try {
      e.preventDefault();
      setLoading(true);
      const res = await postRequest(AUTH.REGISTER, data);
      console.log(res);
      setLoading(false);
      if (res.data?.success) {
        dispatch(setUser(res.data.user));
        setState(AUTH_STATE.EMAIL_VERIFICATION);
        dispatch(timerActive(true));
        toast.success(res?.data?.message);
      }
    } catch (error: any) {
      toast.error(error?.message);
      setLoading(true);
      console.error(error);
    }
  };

  const verifyAccount = async (otp: string[], userID: string) => {
    try {
      setLoading(true);
      const otpStr = otp.join("");
      const res = await postRequest(AUTH.VERIFY_MAIL, { otp: otpStr, userID });
      setLoading(false);
      console.log(res);
      if (res?.data?.success) {
        dispatch(setUser(res?.data?.user));
        dispatch(setLogin(true));
        navigate("/user/onboard");
        toast.success(res?.data?.message);
      }
    } catch (error: any) {
      toast.error(error?.message);
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const res = await postRequest(AUTH.LOGIN, { email, password });
      console.log(res);
      setLoading(false);
      if (res?.data?.success) {
        dispatch(setUser(res?.data?.user));
        dispatch(setLogin(true));
        dispatch(wallet(res.data.wallet.toFixed(2)));
        toast.success(res?.data?.message);
      }
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.message);
    }
  };

  return {
    loading,
    register,
    verifyAccount,
    login,
  };
};
