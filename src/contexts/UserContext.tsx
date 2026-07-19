import { createContext } from "react";

export const UserContext = createContext({
    accessToken: "",
    setAccessToken: (accessToken: string) => {}
});
