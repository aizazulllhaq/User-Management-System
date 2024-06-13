import React from "react";
import Dashboard from "./Dashboard";
import Unauthorized from "../Unauthorized";

const AdminProtected = ({children}) => {
  const isAdmin = true;

  return <div>{isAdmin ? children : <Unauthorized />}</div>;
};

export default AdminProtected;
