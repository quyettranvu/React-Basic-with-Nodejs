import {setCookie,getCookie} from "../helpers/cookies";
import { getLocalStorage, setLocalStorage } from "./setLocationStorage";

export const setAuthentication = (token,user)=>{
    setCookie('token',token);
    setLocalStorage("user",user)
}

export const isAuthenticated = ()=>{
    if(getCookie('token') && getLocalStorage('user')){
        return getLocalStorage('user');
    } else {
        return false;
    }
}