import React, { useEffect, useState } from "react";
import Navbar from "../../../Layouts/Navbar";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useParams } from "react-router-dom";

const EditProfile = ({ user = "std" }) => {
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [grade, setGrade] = useState("");
  const [country, setCountry] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const PATH = user === "std" ? "users/update" : `admin/update/${id}`;

  const onSubmit = async (data) => {
    setSuccessMessage("");
    setErrorMessage("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("profileImage", data.profileImage[0]);
      formData.append("age", data.age);
      formData.append("grade", data.grade);
      formData.append("country", data.country);

      const response = await axios.patch(
        `http://localhost:8080/api/v1/${PATH}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      setSuccessMessage(response.data.message);
      setErrorMessage("");
    } catch (error) {
      console.error(error);
      setErrorMessage(error.response?.data?.message || "An error occurred");
      setSuccessMessage("");
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  useEffect(() => {
    if (user === "admin") {
      const getUser = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/v1/admin/edit/${id}`,
            {
              withCredentials: true,
            }
          );
          const userData = response.data.data;
          setUsername(userData.username);
          setAge(userData.age);
          setGrade(userData.grade);
          setCountry(userData.country);
          setProfileImage(userData.profileAvatar);

          // Populate form default values
          setValue("username", userData.username);
          setValue("age", userData.age);
          setValue("grade", userData.grade);
          setValue("country", userData.country);
        } catch (error) {
          console.error(error);
        }
      };

      getUser();
    } else {
      const getUser = async () => {
        try {
          const response = await axios.get(
            "http://localhost:8080/api/v1/users/edit",
            {
              withCredentials: true,
            }
          );
          const userData = response.data.data.user;
          setUsername(userData.username);
          setAge(userData.age);
          setGrade(userData.grade);
          setCountry(userData.country);
          setProfileImage(userData.profileAvatar);

          // Populate form default values
          setValue("username", userData.username);
          setValue("age", userData.age);
          setValue("grade", userData.grade);
          setValue("country", userData.country);
        } catch (error) {
          console.error(error);
        }
      };

      getUser();
    }
  }, [setValue]);

  return (
    <>
      <Navbar path="loggedIn" />

      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-2 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            {user === "admin" ? "Edit user profile" : "Edit your profile"}
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

          {loading && (
            <div className="flex justify-center mb-4">
              <div>Submitting, please wait...</div>
            </div>
          )}

          <form
            className="space-y-6"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  className="block w-full rounded-md pl-2 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("username", {
                    required: "Username is required",
                  })}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="age"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Age
              </label>
              <div className="mt-2">
                <input
                  id="age"
                  className="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("age", {
                    required: "Age is required",
                  })}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
                {errors.age && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.age.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="grade"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Grade
              </label>
              <div className="mt-2">
                <input
                  id="grade"
                  className="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("grade", {
                    required: "Grade is required",
                  })}
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                />
                {errors.grade && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.grade.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Country
              </label>
              <div className="mt-2">
                <input
                  id="country"
                  className="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("country", {
                    required: "Country is required",
                  })}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
                {errors.country && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.country.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              Profile Image
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center border-0 w-64 px-4 py-2 my-1 bg-white rounded-lg shadow-md cursor-pointer hover:bg-blue-100"
              >
                <img
                  className="w-20 h-20 rounded-xl"
                  src={profileImage}
                  alt="Profile"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  {...register("profileImage")}
                />
              </label>
            </div>

            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {user === "admin" ? "Update User" : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
