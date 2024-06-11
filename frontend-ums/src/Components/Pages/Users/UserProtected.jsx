import React from "react";
import UserProfile from "./UserProfile";
import Unauthorized from "../Unauthorized";

const UserProtected = () => {
  const isUser = true;

  return <div>{isUser ? <UserProfile /> : <Unauthorized />}</div>;
};

export default UserProtected;
