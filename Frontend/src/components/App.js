import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import "./App.css";
import Register from "../containers/Register";
import Connexion from "../containers/Connexion";
import AddSoumi from "../containers/AddSoumi";
import RootLayout from "../containers/Roots";
import SoumissionsList from "./SoumissionsList/SoumissionsList";
import DetailSoumission from "./DetailSoumission/DetailSoumission";
import AllSoumissions from "../containers/AllSoumissions";
import Profile from "../containers/Profile";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "../context/LanguageContext"; // ✅ nouveau

const router = createBrowserRouter([
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

const App = () => (
  <AuthProvider>
    <LanguageProvider> {/* ✅ le nouveau provider est ici */}
      <RouterProvider router={router} />
    </LanguageProvider>
  </AuthProvider>
);

export default App;
