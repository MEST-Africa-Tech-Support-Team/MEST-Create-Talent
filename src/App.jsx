import { createBrowserRouter, RouterProvider } from "react-router";
import CreateTalent from "./pages/CreateTalent";
import Home from "./pages/Home";
import UpdateDetails from "./pages/UpdateDetails";
import CreateProject from "./pages/CreateProject";
import NotFound from "./pages/NotFound";
// import SignUp from "./pages/SignUp";
// import Login from "./pages/Login";

const createTalentRouter = createBrowserRouter([
    { path: '/', element: <Home /> },
    // { path: '/login', element: <Login /> },
    // { path: '/signup', element: <SignUp /> },
    { path: '/create-talent', element: <CreateTalent /> },
    { path: '/create-project', element: <CreateProject /> },
    { path: '/update-details', element: <UpdateDetails /> },
    { path: '*', element: <NotFound /> },
  ]);

export default function App() {

  return (
    <>
    <RouterProvider router={createTalentRouter} />
    </>
  );
}