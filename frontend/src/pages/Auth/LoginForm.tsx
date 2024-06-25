import { Button } from "../../components/ui";
import { Input } from "../../components/ui/Input";
import { FaDiscord, FaFacebook, FaGithub, FaGoogle } from "react-icons/fa";
import { AUTH_STATE } from "../../game/constants";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import { Tooltip } from "../../components/ui/Tooltip";

const LoginForm = ({ setState }: { setState: any }) => {
  const { loading, login } = useAuth(setState);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const GoogleLogin = () => {
    const url = import.meta.env.VITE_REACT_BACKEND_URL + "/api/v1/auth/google";
    window.open(url, "_self");
  };

  return (
    <form className="flex flex-col w-full justify-center items-center px-4 gap-2 ">
      <div className="flex items-center gap-2">
        <FaGoogle
          size={32}
          className="cursor-pointer bg-black p-1 rounded-full  aspect-square"
          onClick={GoogleLogin}
        />
        <Tooltip
          orientation="top"
          tooltipText={[`Not implemented yet.`, "Please login with google"]}
        >
          <FaFacebook
            size={32}
            className="cursor-pointer bg-black p-1 rounded-full  aspect-square"
          />
        </Tooltip>
        <Tooltip
          orientation="top"
          tooltipText={[`Not implemented yet.`, "Please login with google"]}
        >
          <FaGithub
            size={32}
            className="cursor-pointer bg-black p-1 rounded-full  aspect-square"
          />
        </Tooltip>
        <Tooltip
          orientation="top"
          tooltipText={[`Not implemented yet.`, "Please login with google"]}
        >
          <FaDiscord
            size={32}
            className="cursor-pointer bg-black p-1 rounded-full  aspect-square"
          />
        </Tooltip>
      </div>
      <Input
        placeholder="Email"
        onChange={(e) =>
          setData({
            ...data,
            email: e.target.value,
          })
        }
        value={data.email}
      />
      <Input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setData({
            ...data,
            password: e.target.value,
          })
        }
        value={data.password}
      />
      <div className="w-full flex justify-end px-2 mb-2">
        <div
          onClick={() => {
            setState(AUTH_STATE.FORGET_PASSWORD);
          }}
          className="underline text-purple-400 hover:text-blue-500 cursor-pointer"
        >
          Forget password ?
        </div>
      </div>
      <Button
        className="bg-purple-800 w-60  text-gray-300 "
        onClick={(e: any) => {
          e.preventDefault();
          login(data.email, data.password);
        }}
        loading={loading}
      >
        Login
      </Button>

      <div className="flex w-full mt-4 items-center justify-center gap-1">
        Don't have account ?{" "}
        <span
          onClick={() => {
            setState(AUTH_STATE.SIGNUP);
          }}
          className="underline text-purple-500 cursor-pointer hover:text-blue-500"
        >
          Signup
        </span>
      </div>
    </form>
  );
};

export default LoginForm;
