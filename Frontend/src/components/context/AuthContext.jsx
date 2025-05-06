import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  token: null,
  role: null,
  prenom: null,
  email: null,
  adresse: null,
  telephone: null,
  login: () => { },
  logout: () => { },
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [prenom, setPrenom] = useState(null);
  const [email, setEmail] = useState(null);
  const [adresse, setAdresse] = useState(null);
  const [telephone, setTelephone] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("USER RESTAURÉ DU LOCALSTORAGE", parsedUser);
        setUser(parsedUser);
        setToken(storedToken);
        setRole(parsedUser.role);
        setPrenom(parsedUser.prenom);
        setEmail(parsedUser.email);
        setAdresse(parsedUser.adresse);
        setTelephone(parsedUser.telephone);
      } catch (err) {
        console.error("Erreur parsing user", err);
        localStorage.clear();
      }
    }
  }, []);




  const login = (userId, token, prenom, email, adresse, telephone, role, specialite = "") => {
    const userObject = {
      _id: userId.toString(),
      prenom,
      email,
      adresse,
      telephone,
      role,
      specialite
    };

    setUser(userObject);
    setToken(token);
    setRole(role);
    setPrenom(prenom);
    setEmail(email);
    setAdresse(adresse);
    setTelephone(telephone);

    localStorage.setItem("user", JSON.stringify(userObject));
    localStorage.setItem("token", token);
  };


  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    setPrenom(null);
    setEmail(null);
    setAdresse(null);
    setTelephone(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("prenom");
    localStorage.removeItem("email");
    localStorage.removeItem("adresse");
    localStorage.removeItem("telephone");
  };
  const updateUser = (updatedFields) => {
    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{ user, token, role, prenom, email, adresse, telephone, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
