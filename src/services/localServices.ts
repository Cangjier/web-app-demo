import axios from "axios";
import { IProgress } from "./interfaces";
import { BaseServices } from "./baseServices";
const debug = import.meta.env.VITE_DEBUG === "true";
if (debug) {
    console.log("!!! Debug Mode");
}

const LocalServices = () => {
    const base = BaseServices("http://localhost:19799");

    
    return {
        ...base
    }
}

export const localServices = LocalServices();