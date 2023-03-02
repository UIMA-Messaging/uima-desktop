import { useState } from "react";
import { useForm } from "react-hook-form";
import { LoginCredentials } from "../../common/types";
import "../styles/Register.css";

export default function Login() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [isLogingin, setIsLogingin] = useState(false);

  function onClick(data: LoginCredentials) {
    setIsLogingin(true);
    window.electron.login(data);
  }

  return (
    <div className="registration-wrapper" style={isLogingin ? { opacity: 0.5, pointerEvents: "none" } : null}>
      <div>
        <h1>Login</h1>
        <span>Login with your username and password.</span>
        {false && <p className="validation-error">Username or password incorrect.</p>}
      </div>
      <form className="registration-form" onSubmit={handleSubmit(onClick)}>
        {errors.username?.type === "required" && <p className="validation-error">Username is required</p>}
        <input type="text" placeholder="Enter your username" {...register("username", { required: true })} defaultValue="admin" />
        {errors.password?.type === "required" && <p className="validation-error">Password is required</p>}
        <input type="text" placeholder="Enter your password" {...register("password", { required: true })} defaultValue="adminadmin" />
        <input type="submit" value="Login" />
      </form>
      <div className="registration-note">Please note that a user is tied to a device. Your credentials will only be valid on this device.</div>
    </div>
  );
}
