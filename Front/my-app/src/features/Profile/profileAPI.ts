import axios from "axios";
import { MY_LOCALSERVER, MY_SERVERGLOBAL } from "../../VariablesGlob";


const MY_SERVER ="https://theradash.onrender.com/profiles/"


const getProfile = async (token: string, userID: number) => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
  
    try {
      const response = await axios.get(`${MY_SERVERGLOBAL}profiles/${userID}`, config);       
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  

const createProfileAPI = async (token: string, userID: number) => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    try {
      const response = await axios.post(`${MY_SERVERGLOBAL}profiles/create/${userID}/`, config); 

      
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const editProfileAPI = async (token: string, formData: FormData) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };
  
    try {
      const response = await axios.patch(`${MY_SERVERGLOBAL}edit_profile/`, formData, config);
      console.log("API Response:", response.data); 
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  


export { getProfile,createProfileAPI,editProfileAPI};


