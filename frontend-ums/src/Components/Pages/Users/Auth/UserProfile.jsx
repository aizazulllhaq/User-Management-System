import React, { useEffect, useState } from "react";
import Navbar from "../../../Layouts/Navbar";
import { Link } from "react-router-dom";
import axios from "axios";

const UserProfile = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState("");
  const [noOfAttendances, setNoOfAttendances] = useState("");
  const [noOfLeaveRequests, setNoOfLeaveRequests] = useState("");

  const handleAttendence = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/profile/attendance",
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
  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/users/me",
          {
            withCredentials: true,
          }
        );

        setUsername(response.data.data[0].username);
        setNoOfAttendances(response.data.data[0].noOfAttendances);
        setNoOfLeaveRequests(response.data.data[0].noOfLeaveRequests);
      } catch (error) {
        console.error("Internal Server Error");
      }
    };

    getUserData();
  }, []);

  return (
    <>
      <Navbar path="loggedIn" />

      <div className="flex flex-col items-center justify-center my-3 bg-white">
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
        {/* dark theme */}
        <div className="container  m-4">
          <div className="max-w-3xl w-full mx-auto grid gap-4 grid-cols-1">
            {/* profile card */}
            <div className="flex flex-col sticky top-0 z-10">
              <div className="bg-gray-200 border border-gray-300 shadow-lg rounded-2xl p-4">
                <div className="flex justify-between items-start">
                  {" "}
                  {/* Modified line */}
                  <div className="flex-none sm:flex items-center">
                    {" "}
                    {/* Modified line */}
                    <div className="relative h-32 w-32 sm:mb-0 mb-3">
                      <img
                        src="https://tailwindcomponents.com/storage/avatars/njkIbPhyZCftc4g9XbMWwVsa7aGVPajYLRXhEeoo.jpg"
                        alt="aji"
                        className="w-24 h-24 object-cover rounded-2xl"
                      />
                    </div>
                    <div className="flex-auto sm:ml-5 justify-evenly">
                      <div className="flex items-center justify-between sm:mt-2">
                        <div className="flex items-center">
                          <div className="flex flex-col">
                            <div className="w-full flex-none text-xl text-black font-bold leading-none">
                              {username ? username : "Guest"}
                            </div>
                            <div className="flex-auto text-gray-400 my-2">
                              <span className="mr-3 text-black">
                                Software Engineer
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    {" "}
                    {/* Moved from above */}
                    <Link
                      to={"/edit-profile"}
                      className="p-2 my-2 rounded-lg text-white bg-gray-500 hover:bg-gray-700"
                    >
                      Edit profile
                    </Link>
                  </div>
                </div>
                <div className="mx-2">
                  <button
                    onClick={handleAttendence}
                    className="text-lg text-white bg-blue-800 rounded-md px-2 py-1 mr-5 hover:bg-blue-900"
                  >
                    Attendence
                  </button>
                  <Link
                    to="/create-leave-request"
                    className="text-lg text-white bg-red-800 rounded-md px-2 py-1 mr-5 hover:bg-red-900"
                  >
                    Create Leave Request
                  </Link>
                  <Link
                    to={"/view"}
                    className="text-lg text-white bg-green-800 rounded-md px-2 py-1 mr-5 hover:bg-green-900"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>

            {/*-stats*/}
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-12 sm:col-span-4">
                <div className="p-4 relative  bg-gray-200 border border-gray-300 shadow-lg  rounded-2xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-14 w-14  absolute bottom-4 right-3 text-blue-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  ></svg>
                  <div className="flex justify-between items-center ">
                    <i className="fab fa-behance text-xl text-gray-400" />
                  </div>
                  <div className="text-2xl text-black font-serif  leading-8 mt-5">
                    No of Attendance : {noOfAttendances}
                  </div>
                </div>
              </div>
              <div className="col-span-12 sm:col-span-4">
                <div className="p-4 relative  bg-gray-200 border border-gray-300 shadow-lg  rounded-2xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-14 w-14  absolute bottom-4 right-3 text-yellow-300"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  ></svg>
                  <div className="flex justify-between items-center ">
                    <i className="fab fa-codepen text-xl text-gray-400" />
                  </div>
                  <div className="text-2xl text-black font-serif leading-8 mt-5">
                    No of Leave Requests : {noOfLeaveRequests}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
