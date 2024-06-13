import "./App.css";
import Home from "./Components/Home";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PageNotFound from "./Components/Pages/PageNotFound";
import Dashboard from "./Components/Pages/Admin/Dashboard";
import UserProtected from "./Components/Pages/Users/UserProtected";
import AdminProtected from "./Components/Pages/Admin/AdminProtected";
import UserProfile from "./Components/Pages/Users/Auth/UserProfile";
import EditProfile from "./Components/Pages/Users/Auth/EditProfile";
import LeaveRequest from "./Components/Pages/Users/Auth/LeaveRequest";
import Login from "./Components/Pages/Users/Login";
import Register from "./Components/Pages/Users/Register";
import EmailVerification from "./Components/Pages/Users/EmailVerification";
import View from "./Components/Pages/Users/Auth/View";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/userProfile",
      element: (
        <UserProtected>
          <UserProfile />
        </UserProtected>
      ),
    },
    {
      path: "/edit-profile",
      element: (
        <UserProtected>
          <EditProfile />
        </UserProtected>
      ),
    },
    {
      path: "/admin/user-list",
      element: (
        <AdminProtected>
          <Dashboard />
        </AdminProtected>
      ),
    },
    {
      path: "/create-leave-request",
      element: (
        <UserProtected>
          <LeaveRequest />
        </UserProtected>
      ),
    },
    {
      path: "/view",
      element: (
        <UserProtected>
          <View />
        </UserProtected>
      ),
    },
    {
      path: "/verify-email/:token",
      element: <EmailVerification />,
    },
    {
      path: "*",
      element: <PageNotFound />,
    },
  ]);

  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
