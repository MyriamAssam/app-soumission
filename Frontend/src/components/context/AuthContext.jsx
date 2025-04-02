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
    const storedRole = localStorage.getItem("role");
    const storedPrenom = localStorage.getItem("prenom");
    const storedEmail = localStorage.getItem("email");
    const storedAdresse = localStorage.getItem("adresse");
    const storedTelephone = localStorage.getItem("telephone");

    if (storedUser && storedToken && storedRole) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setRole(storedRole);
      setPrenom(storedPrenom);
      setEmail(storedEmail);
      setAdresse(storedAdresse);
      setTelephone(storedTelephone);
    }
  }, []);

  const login = (userId, token, prenom, email, adresse, telephone, role) => {
    setUser(userId);
    setToken(token);
    setRole(role);
    setPrenom(prenom);
    setEmail(email);
    setAdresse(adresse);
    setTelephone(telephone);

    localStorage.setItem("user", JSON.stringify(userId));
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("prenom", prenom);
    localStorage.setItem("email", email);
    localStorage.setItem("adresse", adresse);
    localStorage.setItem("telephone", telephone);
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

  return (
    <AuthContext.Provider
      value={{ user, token, role, prenom, email, adresse, telephone, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
