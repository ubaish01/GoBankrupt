import { FaDiscord, FaFacebook, FaGithub, FaGoogle } from "react-icons/fa";
import { Button } from "../../components/ui";
import { Input } from "../../components/ui/Input";
import { AUTH_STATE } from "../../game/constants";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";

const SignupForm = ({ setState }: { setState: any }) => {
  const { loading, register } = useAuth(setState);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <form className="flex flex-col w-full justify-center items-center px-4 gap-2 ">
      <div className="flex items-center gap-2">
        <FaGoogle
          size={32}
          className="cursor-pointer bg-black p-1 rounded-full  aspect-square"
        />
        <FaFacebook
          size={32}
          className="cursor-pointer bg-black p-1 rounded-full  aspect-square"
        />
        <FaGithub
          size={32}
          className="cursor-pointer bg-black p-1 rounded-full  aspect-square"
        />
        <FaDiscord
          size={32}
          className="cursor-pointer bg-black p-1 rounded-full  aspect-square"
        />
      </div>
      <Input
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      <Input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <Button
        className="bg-purple-800 mt-4 w-60  text-gray-300 "
        onClick={(e: any) => {
          register({ name, email, password, confirmPassword }, e);
        }}
        loading={loading}
      >
        Signup
      </Button>

      <div className="flex w-full mt-4 items-center justify-center gap-1">
        Already have an account ?{" "}
        <span
          onClick={() => {
            setState(AUTH_STATE.LOGIN);
          }}
          className="underline text-purple-500 cursor-pointer hover:text-blue-500"
        >
          Login
        </span>
      </div>
    </form>
  );
};

export default SignupForm;
