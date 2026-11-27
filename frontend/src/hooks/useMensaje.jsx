import { useContext } from "react";
import MensajeContext from "../context/MensajeContext/MensajeProvider.jsx";

export const useMensaje = () => useContext(MensajeContext);
