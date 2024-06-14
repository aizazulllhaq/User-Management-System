import React, { useEffect, useState } from "react";
import Unauthorized from "../Unauthorized";
import { useCookies } from "react-cookie";
import axios from "axios";

const UserProtected = ({ children }) => {
  const [isUser, setIsUser] = useState(false);
  const [cookies] = useCookies(["accessToken"]);

  useEffect(() => {
    const isAuthenticated = async () => {
      try {
        await axios.get("http://localhost:8080/api/v1/users/me", {
          withCredentials: true,
        });
        setIsUser(true);
      } catch (error) {
        setIsUser(false);
      }
    };

    isAuthenticated();
  }, [cookies.accessToken]);

  return <div>{isUser ? children : <Unauthorized />}</div>;
};

export default UserProtected;
