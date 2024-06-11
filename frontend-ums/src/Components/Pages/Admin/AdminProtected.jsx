import React from "react";
import Dashboard from "./Dashboard";
import Unauthorized from "../Unauthorized";

const AdminProtected = () => {
  const isAdmin = true;

  return <div>{isAdmin ? <Dashboard /> : <Unauthorized />}</div>;
};

export default AdminProtected;
