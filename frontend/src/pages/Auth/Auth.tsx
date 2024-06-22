import { Link } from "react-router-dom";
import { AUTH_STATE, IMG } from "../../game/constants";
import { useState } from "react";
import clsx from "clsx";
import logo from "../../assets/Logos/logo.png";
import AuthComponent from "./AuthComponent";

const Auth = () => {
  const [state, setState] = useState(AUTH_STATE.LOGIN);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-[50rem] h-[35rem] grid grid-cols-2 bg-[#262522] transition-all  overflow-hidden rounded-md ">
        <div
          className={clsx(
            "col-span-1 h-full relative",
            state === AUTH_STATE.LOGIN || state == AUTH_STATE.FORGET_PASSWORD
              ? " translate-x-0"
              : " translate-x-full"
          )}
        >
          <img
            className="object-cover brightness-50 h-full"
            src={IMG.LOGIN}
            alt=""
          />
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center flex-col px-4 text-center gap-0">
            <img src={logo} className="w-60" alt="" />
            <h1 className="text-2xl font-bold mt-2 ">
              The Only Casino Where You Can Break the Bank of{" "}
              <Link
                to="https://en.wikipedia.org/wiki/Jeff_Bezos"
                target="_blank"
                className=" text-amber-500 text-shadow"
              >
                Bezos
              </Link>
            </h1>
            <div>
              Feeling lucky? Ready to challenge the odds? GoBankrupt lets you
              experience the thrill of the casino without the real-world risks.
              Play with virtual fortunes of the world's richest and see if you
              can become the ultimate virtual tycoon!
            </div>
          </div>
        </div>
        <div
          className={clsx(
            "col-span-1 flex  w-full transition-all ",
            state === AUTH_STATE.SIGNUP ||
              state == AUTH_STATE.EMAIL_VERIFICATION
              ? " translate-x-[-100%]"
              : " translate-x-0"
          )}
        >
          <AuthComponent state={state} setState={setState} />
        </div>
      </div>
    </div>
  );
};

export default Auth;
