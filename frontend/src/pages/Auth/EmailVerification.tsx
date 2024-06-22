import { FC, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-hot-toast";
import { timerActive } from "../../redux/user/userSlice";
import { AUTH_STATE, OTP_INTERVAL, RESEND_TYPE } from "../../game/constants";
import { postRequest } from "../../services/Request";
import { AUTH } from "../../services/URL";
import { useAuth } from "../../hooks/useAuth";
let currentOtpIndex = 0;

interface props {
  setState: any;
}

const EmailVerification: FC<props> = ({ setState }): JSX.Element => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [seconds, setSeconds] = useState(OTP_INTERVAL);
  const dispatch = useDispatch();

  const { loading, verifyAccount } = useAuth(setState);

  const { timerActive: activeCountdown, user } = useSelector(
    (state: any) => state?.ROOT
  );

  const handleChange = (e: any) => {
    const value = e.target.value;
    // if(top)
    let newOtp = otp;
    otp[currentOtpIndex] = value.substring(value.length - 1);
    setOtp([...newOtp]);
    if (value) setActiveOtpIndex(currentOtpIndex + 1);
    else setActiveOtpIndex(currentOtpIndex - 1);
  };

  const resendOtp = async () => {
    try {
      const data = {
        userId: user._id,
        type: RESEND_TYPE.VERIFICATION,
      };
      const resPromise = postRequest(AUTH.RESEND_OTP, data);
      toast.promise(resPromise, {
        loading: "Sending otp",
        success: "Otp sent",
        error: "Error when fetching",
      });
      const res = await resPromise;
      if (res?.data?.success) {
        setSeconds(OTP_INTERVAL);
        dispatch(timerActive(true));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = (e: any, index: number) => {
    currentOtpIndex = index;
    if (e.key === "Backspace") setActiveOtpIndex(currentOtpIndex - 1);
  };

  const doNothing = (item: Object) => {
    let cpy = item;
    cpy = cpy;
  };

  useEffect(() => {
    let intervalId: any = 0;
    if (seconds > 0) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      dispatch(timerActive(false));
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [seconds]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  useEffect(() => {
    if (activeCountdown === false) {
      setSeconds(0);
    }
  }, [activeCountdown]);

  return (
    <div className="  rounded-md flex flex-col justify-center p-6 items-center  ">
      <h1 className="text-2xl font-bold text-purple-600">Email Verification</h1>

      <div className="w-full flex flex-col justify-center gap-8 mt-4 items-center ">
        <div className="text-sm  w-5/6 text-center ">
          Enter the otp we have sent to your email address{" "}
          <span className="font-semibold">({user?.email})</span> to verify your
          account.
        </div>

        <div className="text-sm  w-5/6 text-center select-none ">
          Entered wrong email ? Go back to{" "}
          <span
            className="font-semibold text-purple-500 cursor-pointer underline"
            onClick={() => {
              setState(AUTH_STATE.SIGNUP);
            }}
          >
            Signup
          </span>
        </div>

        {/* password  */}
        <div className="relative gap-2 justify-center flex  w-full">
          {otp?.map((item: Object, index: number) => (
            <input
              ref={index === activeOtpIndex ? inputRef : null}
              key={index}
              className="w-12 h-12 p-2 appearance-none text-center text-2xl  bg-black  placeholder-gray-600 text-purple-500 outline-purple-700  rounded-md"
              onChange={(e) => {
                handleChange(e);
              }}
              onKeyDown={(e) => {
                handleKeyDown(e, index);
              }}
              value={otp[index]}
              type="number"
              onBlur={() => {
                doNothing(item);
              }}
            />
          ))}
        </div>

        <div className="text-md select-none ">
          did't receive the otp ?{" "}
          <button
            className={`font-semibold text-purple-600 ${
              seconds > 0 ? "cursor-wait" : "cursor-pointer"
            }  `}
            onClick={resendOtp}
            disabled={seconds > 0}
          >
            {"Resend"}
          </button>
        </div>

        <button
          onClick={() => verifyAccount(otp, user._id)}
          className="w-5/6 h-10 bg-purple-900 hover:bg-purple-950 transition-all text-white font-semibold rounded-md"
        >
          {" "}
          {loading ? "loading..." : "Submit"}{" "}
        </button>

        <div className="w-full h-6 flex justify-center">
          {seconds > 0 && (
            <div className="text-2xl text-purple-900 font-bold">
              00 : {seconds < 10 ? `0${seconds}` : seconds}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
