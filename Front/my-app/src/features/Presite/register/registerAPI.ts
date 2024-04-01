import axios from "axios";
import { MY_LOCALSERVER } from"../../../VariablesGlob";
import { MY_SERVERGLOBAL } from "../../../VariablesGlob";
export function registerAPI(credentials: { username: string; password: string; first_name:string, last_name:string, email:string }) {

  return axios.post(`${MY_SERVERGLOBAL}register/`,credentials)
}

