import { useEffect, useState } from "react";
import { BiSave } from "react-icons/bi";
import { signUp, checkUsersExist } from "../data/actions";
import Spinner from "./Spinner";

/* eslint-disable react/prop-types */
export default function SignUp({ setState }) {
  const [loaded, setLoaded] = useState(false);
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const validate = () => {
    const newErrors = { username: "", email: "", password: "" };
    let isValid = true;

    if (!username) {
      newErrors.username = "Username is required";
      setUsername("");
      isValid = false;
    }
    if (!email) {
      newErrors.email = "Email is required";
      setEmail("");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
      setEmail("");
      isValid = false;
    }
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      setPassword("");
      isValid = false;
    }
    if (username.length >= 8) {
      newErrors.username = "Username is too long";
      setUsername("");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrors({ username: "", email: "", password: "" });
    setUsername("");
    setEmail("");
    setPassword("");
    setFile(null);

    if (!validate()) return;

    setLoading(true);

    const { usernameExists, emailExists } = await checkUsersExist(
      username,
      email
    );

    if (usernameExists) {
      setLoading(false);
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: "Username already exists",
      }));
      return;
    }

    if (emailExists) {
      setLoading(false);
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email already exists",
      }));
      return;
    }

    const { data, error } = await signUp(email, password, username, file);

    setLoading(false);

    if (error) {
      console.error("Sign Up Error:", error);
      setErrors({
        username: "",
        email: error.email || "",
        password: "",
      });
    } else {
      console.log("Sign Up Success:", data);
      setUsername("");
      setEmail("");
      setPassword("");
      setFile(null);
      setErrors({ username: "", email: "", password: "" });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${
        loaded ? "opacity-100" : "opacity-0"
      } w-[450px] h-[500px] select-none bg-white p-5 rounded-2xl shadow-xl bg-gradient-to-br from-slate-300 to-zinc-400 flex flex-col gap-6 transition-opacity duration-700 ease-in-out`}
    >
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div>
            <h1 className="text-center font-poppins text-4xl text-slate-700">
              Sign Up
            </h1>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-poppins text-2xl font-normal text-slate-700">
              Type your username
            </label>
            <input
              type="text"
              name="username"
              className={`font-poppins text-lg border h-7 rounded-lg pl-2 bg-white focus:outline-none ${
                errors.username ? "border-red-500" : "border-gray-300"
              } focus:ring-2 ${
                errors.username ? "focus :ring-red-500" : "focus:ring-cyan-600"
              } focus:border-transparent`}
              value={username}
              onChange={handleInputChange(setUsername)}
              placeholder={errors.username || "Enter username"}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-poppins text-2xl font-normal text-slate-700">
              Type your Email
            </label>
            <input
              type="text"
              name="email"
              className={`font-poppins text-lg border h-7 rounded-lg pl-2 bg-white focus:outline-none ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:ring-2 ${
                errors.email ? "focus:ring-red-500" : "focus:ring-cyan-600"
              } focus:border-transparent`}
              value={email}
              onChange={handleInputChange(setEmail)}
              placeholder={errors.email || "Enter email"}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-poppins text-2xl font-normal text-slate-700">
              Create new Password
            </label>
            <input
              type="password"
              name="password"
              className={`border h-7 rounded-lg pl-2 bg-white focus:outline-none ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:ring-2 ${
                errors.password ? "focus:ring-red-500" : "focus:ring-cyan-600"
              } focus:border-transparent`}
              value={password}
              onChange={handleInputChange(setPassword)}
              placeholder={errors.password || "Enter password"}
            />
            <span className="font-poppins text-base">
              Already have an account,{" "}
              <span
                onClick={() => setState(false)}
                className="text-slate-800 hover:text-cyan-600 duration-300 transition-all cursor-pointer"
              >
                Sign in
              </span>
            </span>
          </div>
          <div className="font-poppins flex justify-around">
            <div className="flex items-center gap-2">
              <div className="rounded-full w-20 h-20 bg-white overflow-hidden">
                {file && (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Selected"
                    className="object-cover w-full h-full"
                  />
                )}
              </div>

              <input
                type="file"
                id="fileInput"
                className="w-0 h-0 opacity-0"
                onChange={handleFileChange}
              />

              <label
                htmlFor="fileInput"
                className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer text-cyan-600 hover:text-cyan-800 transition-colors duration-300"
              >
                <BiSave className="w-16 h-16" />
              </label>
            </div>

            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="w-36 h-12 bg-white font-poppins text-slate-700 duration-300 transition-all rounded-sm hover:bg-cyan-600 hover:text-white"
              >
                Sign Up
              </button>
            </div>
          </div>
        </>
      )}
    </form>
  );
}
