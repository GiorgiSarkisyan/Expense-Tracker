/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { signIn } from "../data/actions";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";

export default function Login({ setState }) {
  const [loaded, setLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    setLoaded(true);
  }, []);

  const validate = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!email) {
      newErrors.email = "Email is required";
      setEmail("");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
      setEmail("");
      isValid = false;
    }
    if (!password) {
      newErrors.password = "Password is required";
      setPassword("");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (setter, fieldName) => (e) => {
    setter(e.target.value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: "",
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if (!validate()) {
      setLoading(false);
      return;
    }

    try {
      const data = await signIn(email, password);
      console.log("Login Successful:", data);
      navigate("/");
    } catch (error) {
      setErrors({
        email: "Email or password is incorrect",
        password: "Email or password is incorrect",
      });
      console.error("Sign In Error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-80 h-96 select-none bg-white p-5 rounded-2xl shadow-xl bg-gradient-to-br from-slate-300 to-zinc-400 flex flex-col gap-6
        ${
          loaded ? "opacity-100" : "opacity-0"
        } transition-opacity duration-700 ease-in-out`}
    >
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div>
            <h1 className="text-center font-poppins text-4xl text-slate-700">
              Login
            </h1>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-poppins text-2xl font-normal text-slate-700">
              Email
            </label>
            <input
              type="text"
              className={`font-poppins text-lg border h-7 rounded-lg pl-2 bg-white focus:outline-none ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-cyan-600 focus:border-transparent`}
              value={email}
              required
              onChange={handleInputChange(setEmail, "email")}
              placeholder={errors.email}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-poppins text-2xl font-normal text-slate-700">
              Password
            </label>
            <input
              type="password"
              className={`border h-7 rounded-lg pl-2 bg-white focus:outline-none ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-cyan-600 focus:border-transparent`}
              value={password}
              required
              onChange={handleInputChange(setPassword, "password")}
              placeholder={errors.password}
            />
            <span className="font-poppins text-base">
              Don&apos;t have an account?{" "}
              <span
                onClick={() => setState(true)}
                className="text-slate-800 hover:text-cyan-600 duration-300 transition-all cursor-pointer"
              >
                Sign Up
              </span>
            </span>
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="w-36 h-12 bg-white font-poppins text-slate-700 duration-300 transition-all rounded-sm hover:bg-cyan-600 hover:text-white"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign in"}
            </button>
          </div>
        </>
      )}
    </form>
  );
}
