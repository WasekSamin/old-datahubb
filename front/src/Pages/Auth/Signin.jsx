import React, { useState } from "react";
import AuthUtils from "../Utils/AuthUtils";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeDots } from "react-loader-spinner";
import loginLogo from "../../assets/login-logo.png";

export default function Signin() {
  const { http, setToken } = AuthUtils();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    await http
      .post("/api/login/", {
        email: email,
        password: password,
      })
      .then((response) => {
        setToken(response.data.user, response.data.access);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      })
      .catch((error) => {
        setError(true);
        setLoading(false);
        toast.error(error);
      });
  };

  return (
    <div className="bg-slate-100">
      <ToastContainer />
      <div className="p-5 container mx-auto h-full w-[30%] border bg-white rounded my-[80px] flex flex-col sm:flex-row items-center justify-between">
        <div className="flex flex-col items-center w-full">
          <div className="flex items-start justify-between w-full p-5">
            <div className="w-full">
              <img src={loginLogo} alt="" />
            </div>
            {/* <Link to="/signup"
                 className="flex items-center justify-center border text-blue-500 rounded hover:bg-blue-500 hover:text-white transition-all p-2 w-[140px] font-semibold">
                    Signup
                </Link> */}
          </div>
          <form onSubmit={handleLogin} className="w-full">
            <div className="text-left w-full p-5 ">
              <small className="text-red-500">*Required</small>
              <div className="relative">
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email"
                  className="w-full p-4 border rounded"
                />
                <div className="absolute">
                  {/* icon inside input field goes here */}
                </div>
              </div>
            </div>

            <div className="text-left w-full p-5">
              <small className="text-red-500">*Required</small>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                className="w-full p-4 border rounded"
              />
            </div>

            {error ? (
              <div className="w-full text-sm text-red-600 mx-5">
                *Email or Password doesn't match our records
              </div>
            ) : (
              <div></div>
            )}

            <div className="text-left w-full p-5">
              <button
                type="submit"
                className="cursor-pointer w-full bg-blue-500 p-3 text-white font-semibold rounded hover:bg-blue-600 transition-all"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <ThreeDots
                      height="20"
                      width="20"
                      radius="5"
                      color="#ffffff"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClassName=""
                      visible={true}
                    />
                  </div>
                ) : (
                  <div>Sign in</div>
                )}
              </button>
            </div>
          </form>
        </div>
        {/* <div id="imageSection" className="w-[100%]">
                <img src={sampleImage1} alt="" />
        </div>    */}
      </div>
    </div>
  );
}
