import { IoIosNotifications, IoMdSearch } from "react-icons/io";
import logo from "../assets/Logos/logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AVATAR } from "../game/constants";
import { useEffect, useRef, useState } from "react";
import { getRequest } from "../services/Request";
import { AUTH } from "../services/URL";
import {
  user as setUser,
  login as setLogin,
  wallet as setWallet,
} from "../redux/user/userSlice";
import clsx from "clsx";
import { formatBalance } from "../helper";
import toast from "react-hot-toast";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { login, user, wallet } = useSelector((state: any) => state.ROOT);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const optionRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: any) => {
      if (optionRef && !optionRef?.current?.contains(e.target))
        setOptionsOpen(false);
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const getUser = async () => {
    if (login) return;
    try {
      const res = await getRequest(AUTH.GET_USER_INFO);
      const data = res.data;
      if (data.success) {
        toast.success(data.message);
        dispatch(setLogin(true));
        dispatch(setUser(data.user));
        dispatch(setWallet(data.wallet));
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    console.log("I am renderring");
    getUser();
  }, []);

  const logout = async () => {
    try {
      const res = await getRequest(AUTH.LOGOUT);
      if (res.data.success) {
        dispatch(setUser(null));
        dispatch(setLogin(false));
        dispatch(setWallet({ _id: null, balance: 0 }));
        toast.success("Successfully logged out.", { position: "top-center" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const show = !(
    location.pathname?.includes("/auth") ||
    location.pathname?.includes("/user/onboard") ||
    !login
  );
  return (
    show && (
      <div className="bg-[#1A2C38] fixed z-50 w-full h-16 flex items-center justify-between px-40 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
        <div
          className="items-center cursor-pointer gap-2 flex"
          onClick={() => navigate("/")}
        >
          <img src={logo} className="w-14" alt="logo" />
          <div className="font-bold text-2xl">
            Go<span className="text-purple-500">Bankrupt</span>
          </div>
        </div>
        <div className="items-center  flex rounded-md overflow-hidden">
          <div className="bg-black w-48 px-8 py-3">
            $ {formatBalance(wallet?.balance)}
          </div>
          <div className="bg-purple-700 w-24 text-center font-bold px-4 py-3 cursor-pointer">
            Wallet
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1 cursor-pointer">
            <IoMdSearch size={20} />
            search
          </div>
          <IoIosNotifications size={24} className="cursor-pointer" />
          <img
            ref={optionRef}
            onClickCapture={() => {
              setOptionsOpen((prev) => !prev);
            }}
            src={AVATAR[user?.avatar || 1]}
            className="w-10 aspect-square cursor-pointer active:scale-95 rounded-full object-cover"
          />
          <div
            className={clsx(
              optionsOpen ? "flex" : "hidden",
              "w-32  top-[4.1rem] flex items-center justify-center  flex-col absolute overflow-hidden rounded-md bg-gray-800  right-28"
            )}
          >
            <div className="hover:bg-gray-900 cursor-pointer w-full py-2 text-center">
              Profile
            </div>
            <div
              onClick={logout}
              className="hover:bg-gray-900 active:scale-95 cursor-pointer w-full py-2 text-center"
            >
              Logout
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Header;
