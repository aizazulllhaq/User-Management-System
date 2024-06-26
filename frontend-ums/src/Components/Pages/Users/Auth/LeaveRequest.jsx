import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Navbar from "../../../Layouts/Navbar";
import axios from "axios";

const LeaveRequest = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/profile/leave-request",
        {
          from: data.from,
          to: data.to,
          reason: data.reason,
        },
        {
          withCredentials: true,
        }
      );

      setSuccessMessage(response.data.message);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setSuccessMessage("");
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-2 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          

          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create Leave Request
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
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
          <form
            className="space-y-6"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div>
              <label
                htmlFor="from"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                From
              </label>
              <div className="mt-2">
                <input
                  id="from"
                  className="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("from", {
                    required: "From Date is required",
                  })}
                  placeholder="  Date "
                />
                {errors.from && (
                  <span className="text-red-500">{errors.from.message}</span>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="to"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                To
              </label>
              <div className="mt-2">
                <input
                  id="to"
                  className="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("to", {
                    required: "To Date is required",
                  })}
                  placeholder="  Date"
                />
                {errors.to && (
                  <span className="text-red-500">{errors.to.message}</span>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Reason
                </label>
              </div>
              <div className="mt-2">
                <textarea
                  id="reason"
                  className="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("reason", {
                    required: "Reason is required",
                  })}
                  placeholder="  Enter Leave Request Reason"
                />
                {errors.reason && (
                  <span className="text-red-500">{errors.reason.message}</span>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Send to Admin
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LeaveRequest;
