import React, { useState } from "react";
import Navbar from "../../Layouts/Navbar";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link, useNavigate  } from "react-router-dom";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setCookie] = useCookies(["accessToken"]);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setSuccessMessage("");
    setErrorMessage("");
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/users/login",
        {
          email: data.email,
          password: data.password,
        },
        {
          withCredentials: true,
        }
      );

      const accessToken = response.data.data.accessToken;
      setCookie("accessToken", accessToken);
      navigate("/userProfile");

      setSuccessMessage(response.data.message);
      setErrorMessage("");
    } catch (error) {
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar path={"login"} />

      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Login to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {/* Success & Error Messages  */}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-center mb-4">
              <div>Verifying, please wait...</div>
            </div>
          )}

          <form
            className="space-y-6"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is Required",
                    pattern: {
                      value: /([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}/gim,
                      message: "Email is not valid",
                    },
                  })}
                  className="block pl-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.email && (
                  <span className="text-red-500">{errors.email.message}</span>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  {...register("password", {
                    required: "Password is Required",
                  })}
                  type="password"
                  className="block pl-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.password && (
                  <span className="text-red-500">
                    {errors.password.message}
                  </span>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a user ?
            <Link
              to="/register"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Register now
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
