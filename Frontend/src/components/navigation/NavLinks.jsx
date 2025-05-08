import { useTranslation } from "react-i18next";
import { useContext, useState, useEffect } from "react";
import "./NavLinks.css";
import { NavLink } from "react-router-dom";
import { useHttpClient } from "../../hooks/http-hook";
import { AuthContext } from "../context/AuthContext";



const NavLinks = () => {
  const auth = useContext(AuthContext);
  const { t } = useTranslation();
  const [type, setType] = useState("");
  const { sendRequest } = useHttpClient();

  useEffect(() => {
    async function infoProfil() {
      const userId = auth.user?._id || auth.user?.userId;
      if (!userId) return;

      const foundUserData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `users/find/${auth.user._id}/`,
        "GET", null, { "Content-Type": "application/json" }
      );
      setType(foundUserData.users[0].role);
    }
    if (auth.user !== null) infoProfil();
  }, [auth.user]);

  return (
    <>
      {auth.user === null ? (
        <>
          <li><NavLink to="/connexion">{t("nav.login")}</NavLink></li>
          <li><NavLink to="/register">{t("nav.register")}</NavLink></li>
          <li><NavLink to="/all">{t("nav.allSubmissions")}</NavLink></li>
        </>
      ) : (
        <>
          <li><NavLink to="/connexion" onClick={() => auth.logout()}>{t("nav.logout")}</NavLink></li>
          <li><NavLink to="/profil">{t("nav.profile")}</NavLink></li>
          <li><NavLink to="/soumissions">{t("nav.myList")}</NavLink></li>
          <li><NavLink to="/all">{t("nav.allSubmissions")}</NavLink></li>
        </>
      )}
    </>
  );
};


export default NavLinks;
