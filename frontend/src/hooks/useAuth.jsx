import { useContext } from "react";
import AuthContext from "../context/AuthContext/AuthProvider.jsx";

export const useAuth = () => useContext(AuthContext);
