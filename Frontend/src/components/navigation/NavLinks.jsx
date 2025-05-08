import { useContext, useState, useEffect } from "react";
import "./NavLinks.css";
import { NavLink } from "react-router-dom";
import { useHttpClient } from "../../hooks/http-hook";
import { AuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const NavLinks = () => {
  const { t } = useTranslation();
  const auth = useContext(AuthContext);
  const [type, setType] = useState("");
  const { sendRequest } = useHttpClient();


  useEffect(() => {
    async function infoProfil() {
      try {
        const userId = auth.user?._id || auth.user?.userId;
        if (!userId) return;

        const foundUserData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `users/find/${auth.user._id}/`,



          "GET",
          null,
          {
            "Content-Type": "application/json",
          }
        );
        setType(foundUserData.users[0].role);
        console.log(foundUserData.users[0]);
      } catch (e) {
        console.error(e);
      }
    }

    if (auth.user !== null) {
      infoProfil();
    }
  }, [auth.user]);


  return (
    <ul className="navi-links">
      {auth.user === null ? (
        <>
          <li><NavLink to="/connexion">{t("nav.login")}</NavLink></li>
          <li><NavLink to="/register">{t("nav.register")}</NavLink></li>
          <li><NavLink to="/all">{t("nav.allSubmissions")}</NavLink></li>

        </>
      ) : (
        <ul className="navi-links">

          <li><NavLink to="/connexion" onClick={() => auth.logout()}>{t("nav.logout")}</NavLink></li>
          <li><NavLink to="/profil">{t("nav.profile")}</NavLink></li>
          <li><NavLink to="/soumissions">{t("nav.myList")}</NavLink></li>
          <li><NavLink to="/all">{t("nav.allSubmissions")}</NavLink></li>
          <>


          </>

        </ul>
      )}
    </ul>
  );
};

export default NavLinks;
