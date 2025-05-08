import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import Register from "../containers/Register";
import Connexion from "../containers/Connexion";
import AddSoumi from "../containers/AddSoumi";

import RootLayout from "../containers/Roots";
import SoumissionsList from "../components/SoumissionsList/SoumissionsList";
import DetailSoumission from "../components/DetailSoumission/DetailSoumission";
import AllSoumissions from "../containers/AllSoumissions";
import Profile from "../containers/Profile";
import LanguageSwitcher from "./LanguageSwitcher";

const App = () => {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { path: "/", element: <Navigate to="/connexion" /> },
        { path: "/connexion", element: <Connexion /> },
        { path: "/register", element: <Register /> },
        { path: "/soumissions", element: <SoumissionsList /> },
        { path: "/soumission/:id", element: <DetailSoumission /> },
        { path: "/add-soumi", element: <AddSoumi /> },
        { path: "/all", element: <AllSoumissions /> },
        { path: "/profil", element: <Profile /> },
      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={routes} />
    </div>
  );
};

export default App;
