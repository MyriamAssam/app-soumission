import React, { useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import Register from "../containers/Register";
import Connexion from "../containers/Connexion";
import AddSoumi from "../containers/AddSoumi";
import "./App.css";
import RootLayout from "../containers/Roots";
import SoumissionsList from "../components/SoumissionsList/SoumissionsList";
import DetailSoumission from "../components/DetailSoumission/DetailSoumission";
import AllSoumissions from "../containers/AllSoumissions";
import Profile from "../containers/Profile";
import { useTranslation } from "react-i18next";
import '../i18n';

const App = () => {
  const { i18n } = useTranslation();
  const [error, setError] = useState(null);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

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
      <div className="language-buttons">
        <button onClick={() => changeLanguage("fr")} className="lang-btn">FR</button>
        <button onClick={() => changeLanguage("en")} className="lang-btn">EN</button>
      </div>

      {error && <div>{error}</div>}
      <RouterProvider router={routes} />
    </div>
  );
};

export default App;
