import SignInGithub from "./signInGithub";
import SignInGoogle from "./signInGoogle";

const AuthForm = () => {
  return (
    <div className="flex flex-col gap-4">
      <SignInGoogle />
      <SignInGithub />
    </div>
  );
};

export default AuthForm;
