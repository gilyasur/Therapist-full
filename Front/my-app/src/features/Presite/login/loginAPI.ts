import axios, { AxiosError, AxiosResponse } from 'axios';
import { MY_SERVERGLOBAL } from '../../../VariablesGlob';
import { MY_LOCALSERVER } from '../../../VariablesGlob';
export function login(credentials: { username: string; password: string }) {

  return axios.post(`${MY_SERVERGLOBAL}login/`, credentials)

}


export function forgotPassAPI(credentials: {username: string}) {
  return axios.post(`${MY_SERVERGLOBAL}sendResetEmail/`, credentials)
}


interface ResetPasswordResponse {
  success: boolean;
  message: string;
}


export async function resetPassAPI(credentials: { username: string; id: number; new_password: string }): Promise<AxiosResponse<ResetPasswordResponse>> {
  const MY_SERVER = 'https://theradash.onrender.com/reset-password';
  const config = {
  };

  try {
    const response = await axios.patch(`${MY_SERVER}/${credentials.id}/`, credentials, config);
    console.log('Response:', response.data);
    return response;
  } catch (error) {
    console.error('Error in Reset Password:', error);


    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      console.error('Response Data:', responseData);
    }

    throw error;
  }
}