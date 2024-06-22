import { AUTH_STATE } from "../../game/constants";
import EmailVerification from "./EmailVerification";
import ForgetPassword from "./ForgetPassword";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const AuthComponent = ({
  state,
  setState,
}: {
  state: number;
  setState: any;
}) => {
  switch (state) {
    case AUTH_STATE.LOGIN:
      return <LoginForm setState={setState} />;
    case AUTH_STATE.SIGNUP:
      return <SignupForm setState={setState} />;
    case AUTH_STATE.EMAIL_VERIFICATION:
      return <EmailVerification setState={setState} />;
    case AUTH_STATE.FORGET_PASSWORD:
      return <ForgetPassword setState={setState} />;
  }
};

export default AuthComponent;
