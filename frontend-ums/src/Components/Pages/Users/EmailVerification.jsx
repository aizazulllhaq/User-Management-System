import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../Layouts/Navbar";

const EmailVerification = () => {
  const { token } = useParams();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/users/verify-email?token=${token}`
        );
        setSuccessMessage(response.data.message);
        setErrorMessage("");
      } catch (error) {
        setErrorMessage(error.response.data.message);
        setSuccessMessage("");
      }
    };

    verifyEmail();
  }, [token]);
  return (
    <>
      <Navbar />
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="font-semibold text-indigo-600 text-7xl">
            {successMessage ? "Thank you" : "Oops Sorry"}
          </p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {successMessage ? successMessage : errorMessage}
          </h1>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {successMessage ? (
              <Link
                to="/login"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Login to account
              </Link>
            ) : (
              <div className="text-xl ">
                <b>Oops </b>!! please enter valid token to verify your mail
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default EmailVerification;
