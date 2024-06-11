import "./App.css";
import Home from "./Components/Home";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./Components/Pages/Login";
import Register from "./Components/Pages/Register";
import PageNotFound from "./Components/Pages/PageNotFound";
import UserProfile from "./Components/Pages/Users/UserProfile";
import EditProfile from "./Components/Pages/EditProfile";
import Dashboard from "./Components/Pages/Admin/Dashboard";
import UserProtected from "./Components/Pages/Users/UserProtected";
import AdminProtected from "./Components/Pages/Admin/AdminProtected";

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
      element: <EditProfile />,
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
