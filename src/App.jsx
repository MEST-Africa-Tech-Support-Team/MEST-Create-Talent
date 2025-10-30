import { createBrowserRouter, RouterProvider } from "react-router";
import CreateTalent from "./pages/CreateTalent";
import Home from "./pages/Home";
import UpdateDetails from "./pages/UpdateDetails";
import NotFound from "./pages/NotFound";

const createTalentRouter = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: '/create-talent', element: <CreateTalent /> },
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