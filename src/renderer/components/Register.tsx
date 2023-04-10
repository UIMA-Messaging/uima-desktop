import { useState } from "react";
import { useForm } from "react-hook-form";
import { Registration } from "../../common/types";
import imageToUrl from "../api/images";
import "../styles/Register.css";

export default function Register() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string>();

  window.electron.onRegistrationError((_, error) => {
    setError(error);
    setIsRegistering(false);
  });

  async function onClick(data: Registration) {
    setIsRegistering(true);
    let imageUrl = null;
    if (data.image[0]) {
      imageUrl = await imageToUrl(data.image[0]);
    }
    window.electron.register({ ...data, image: imageUrl });
  }

  return (
    <div className="registration-wrapper" style={isRegistering ? { opacity: 0.5, pointerEvents: "none" } : null}>
      <div>
        <h1>Registration</h1>
        <span>Looks like this is the first time you are running this app. Register a user and begin chating!</span>
        {error && <p className="registration-error">{error}</p>}
      </div>
      <form className="registration-form" onSubmit={handleSubmit(onClick)}>
        {errors.username?.type === "required" && <p className="validation-error">Username is required</p>}
        {errors.username?.type === "maxLength" && <p className="validation-error">Username must cannot be longer than 20 characters</p>}
        <input type="text" placeholder="Enter a username" {...register("username", { required: true, maxLength: 20 })} defaultValue="greffgreff" />
        {errors.password?.type === "required" && <p className="validation-error">Password is required</p>}
        {errors.password?.type === "minLength" && <p className="validation-error">Password must be at least 10 characters long</p>}
        <input type="password" placeholder="Enter a password" {...register("password", { required: true, minLength: 10 })} defaultValue="Gaojinglu80!" />
        <input type="file" {...register("image")} />
        <input type="submit" value="Register" />
      </form>
      <div className="registration-note">Please note that a user is tied to a device. Upon registration, your credentials will only be valid on this device.</div>
    </div>
  );
}
