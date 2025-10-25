import { createBrowserRouter, RouterProvider } from "react-router";
import CreateTalent from "./pages/CreateTalent";
import Home from "./pages/Home";

const createTalentRouter = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: '/create-talent', element: <CreateTalent /> },
  ]);

export default function App() {

  return (
    <>
    <RouterProvider router={createTalentRouter} />
    </>
  );
}