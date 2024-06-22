import { FC, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  timerActive,
  user as setUser,
  login as setLogin,
} from "../../redux/user/userSlice";
import { AUTH_STATE, OTP_INTERVAL, RESEND_TYPE } from "../../game/constants";
import { postRequest } from "../../services/Request";
import { AUTH } from "../../services/URL";
import { Button } from "../../components/ui";
import { Input } from "../../components/ui/Input";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

interface props {
  setState: any;
}

const FORM_STATE = {
  EMAIL: 0,
  VERIFY_OTP: 1,
  UPDATE_PASSWORD: 2,
};

const ForgetPassword: FC<props> = ({ setState }): JSX.Element => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [seconds, setSeconds] = useState(OTP_INTERVAL);
  //@ts-ignore
  const [loading, setLoading] = useState(0);
  //@ts-ignore
  const [sending, setSending] = useState(0);
  const [formState, setFormState] = useState(FORM_STATE.EMAIL);
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { timerActive: activeCountdown } = useSelector(
    (state: any) => state?.ROOT
  );

  const forgetPassword = async (e: any) => {
    setLoading(1);
    try {
      e.preventDefault();
      const res = await postRequest(AUTH.FORGET_PASSWORD, { email });
      if (res.data.success) {
        dispatch(timerActive(true));
        setFormState(FORM_STATE.VERIFY_OTP);
        toast.success(res?.data?.message);
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(0);
  };

  const updatePassword = async () => {
    try {
      setLoading(1);
      console.log(otp);
      const otpStr = otp.join("");
      const res = await postRequest(AUTH.FORGET_PASSWORD_VERIFY, {
        otp: otpStr,
        email,
        password,
      });
      setLoading(0);
      console.log(res);
      if (res?.data?.success) {
        dispatch(setUser(res?.data?.user));
        dispatch(setLogin(true));
        navigate("/user/onboard");
        toast.success(res?.data?.message);
      }
    } catch (error: any) {
      toast.error(error?.message);
      setLoading(0);
    }
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

  switch (formState) {
    case FORM_STATE.EMAIL:
      return (
        <EmailState
          email={email}
          setEmail={setEmail}
          sendOtp={forgetPassword}
          loading={loading}
          moveToLogin={() => {
            setState(AUTH_STATE.LOGIN);
          }}
        />
      );
    case FORM_STATE.VERIFY_OTP:
      return (
        <VerifyOTP
          otp={otp}
          setOtp={setOtp}
          email={email}
          moveToLogin={() => {
            setState(AUTH_STATE.LOGIN);
          }}
          next={() => {
            setFormState(FORM_STATE.UPDATE_PASSWORD);
          }}
        />
      );
    case FORM_STATE.UPDATE_PASSWORD:
      return (
        <UpdatePassword
          password={password}
          confirmPassword={confirmpassword}
          setConfirmPassword={setConfirmPassword}
          setPassword={setPassword}
          updatePassword={updatePassword}
          back={() => setFormState(FORM_STATE.VERIFY_OTP)}
        />
      );
    default:
      return <></>;
  }
};

let activeOtpIndex = 0;
const EmailState = ({
  email,
  sendOtp,
  loading,
  setEmail,
  moveToLogin,
}: {
  email: string;
  loading: any;
  sendOtp: any;
  moveToLogin: () => void;
  setEmail: any;
}) => {
  return (
    <div className="w-full  rounded-md flex flex-col gap-4 justify-center p-6 items-center ">
      <h1 className="text-2xl font-bold text-purple-600">Forget password</h1>
      <form
        onSubmit={sendOtp}
        className="w-full p-2 flex flex-col justify-center gap-4 items-center"
      >
        <Input
          disabled={loading === 1 ? true : false}
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />

        <Button
          disabled={loading === 1 || !email.length ? true : false}
          className={
            loading === 1 || !email.length
              ? "bg-gray-600 w-48"
              : "bg-purple-700 hover:bg-purple-800 w-48"
          }
          loading={loading}
          onClick={() => {}}
        >
          Submit
        </Button>

        <div className="text-white">
          Go back to login{" "}
          <span
            className="cursor-pointer text-purple-500 font-bold underline"
            onClick={moveToLogin}
          >
            Login
          </span>
        </div>
      </form>
    </div>
  );
};

let currentOtpIndex = 0;

const VerifyOTP = ({
  moveToLogin,
  otp,
  setOtp,
  next,
  email,
}: {
  moveToLogin: any;
  setOtp: (otp: string[]) => void;
  otp: string[];
  next: () => void;
  email: string;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [seconds, setSeconds] = useState(OTP_INTERVAL);
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  const { timerActive: activeCountdown } = useSelector(
    (state: any) => state.ROOT
  );

  const dispatch = useDispatch();

  const handleChange = (e: any) => {
    const value = e.target.value;
    let newOtp = otp;
    otp[currentOtpIndex] = value.substring(value.length - 1);
    setOtp([...newOtp]);
    if (value) setActiveOtpIndex(currentOtpIndex + 1);
    else setActiveOtpIndex(currentOtpIndex - 1);
    if (otp.length === 6 && currentOtpIndex === 5) next();
  };

  const handleKeyDown = (e: any, index: number) => {
    currentOtpIndex = index;
    if (e.key === "Backspace") setActiveOtpIndex(currentOtpIndex - 1);
  };

  const resend = async () => {
    try {
      const data = {
        email,
        type: RESEND_TYPE.FORGET_PASSWORD,
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
    <div className=" rounded-md flex flex-col justify-center p-6 items-center ">
      <h1 className="text-2xl font-bold text-purple-600">Enter the otp</h1>

      <div className="w-full flex flex-col justify-center gap-4 mt-4 items-center ">
        {/* OTP  */}
        <div className="text-sm  w-5/6 text-center ">
          Enter the otp we have sent to your email address.
        </div>

        <div className="text-sm  w-5/6 text-center select-none ">
          Entered wrong email ? Go back to{" "}
          <span
            className="font-semibold text-purple-500 cursor-pointer underline"
            onClick={moveToLogin}
          >
            Login
          </span>
        </div>

        <div className="relative gap-2 justify-center flex  w-full">
          {otp?.map((item: any, index) => (
            <input
              ref={index === activeOtpIndex ? inputRef : null}
              key={index}
              className="w-12 h-12 p-2 appearance-none text-center text-xl  bg-black  placeholder-gray-600 text-purple-500 outline-purple-700  rounded-md"
              onChange={(e) => {
                handleChange(e);
              }}
              onKeyDown={(e) => {
                handleKeyDown(e, index);
              }}
              value={otp[index]}
              type="number"
              onAbortCapture={() => {
                console.error(item);
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
            onClick={resend}
            disabled={seconds > 0}
          >
            {"Resend"}
          </button>
        </div>

        <button
          onClick={next}
          className="w-5/6 h-10 bg-purple-900 hover:bg-purple-950 transition-all text-white font-semibold rounded-md"
        >
          Next
        </button>

        <div className="w-full h-6 flex justify-center">
          {seconds > 0 && (
            <div className="text-2xl text-gray-500 font-bold">
              00 : {seconds < 10 ? `0${seconds}` : seconds}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const UpdatePassword = ({
  password,
  confirmPassword,
  setPassword,
  updatePassword,
  setConfirmPassword,
  back,
}: {
  password: string;
  confirmPassword: string;
  updatePassword: any;
  setConfirmPassword: (v: string) => void;
  setPassword: (v: string) => void;
  back: () => void;
}) => {
  return (
    <div className="w-full flex flex-col gap-3 px-4 items-center justify-start">
      <div
        onClick={back}
        className="flex items-center gap-1 cursor-pointer text-xl w-full justify-start mb-20 pt-4"
      >
        <IoMdArrowBack />
        Back
      </div>
      <h1 className="text-purple-500 uppercase mb-6 text-2xl font-bold">
        update password
      </h1>
      <Input
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <Input
        type="password"
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
        }}
      />
      <Button
        onClick={updatePassword}
        className="bg-purple-600 hover:bg-purple-700 w-60 mt-2"
      >
        Update
      </Button>
    </div>
  );
};

export default ForgetPassword;
