import axios from "axios";
import { ILoginInfo, IProgress, IUserInfomation } from "./interfaces";
import { BaseServices } from "./baseServices";
const debug = import.meta.env.VITE_DEBUG === "true";
if (debug) {
    console.log("!!! Debug Mode");
}

const LocalServices = () => {
    const base = BaseServices((window as any).webapplication.baseURL ?? "http://localhost:12332");
    const { api, runAsync } = base;


    return {
        ...base
    }
}

export const localServices = LocalServices();