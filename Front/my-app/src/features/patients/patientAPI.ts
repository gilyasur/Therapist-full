
import axios from "axios"
import { MY_LOCALSERVER } from "../../VariablesGlob";
import { MY_SERVERGLOBAL } from "../../VariablesGlob";







const getPatient = async (token: any) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    const response = await axios.get(`${MY_SERVERGLOBAL}patients/`, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};


const createPatient = async (token: any, patientData: any) => {

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    const response = await axios.post(`${MY_SERVERGLOBAL}patients/`, patientData, config);
    return response.data;
  } catch (error) {
    console.error('Error in createPatient:', error);


    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      console.error('Response Data:', responseData);
    }

    throw error; 
  }
};

const updatePaitentAPI = async (token: any, patientData: any) => {

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    const response = await axios.patch(`${MY_SERVERGLOBAL}patients/${patientData.id}/`, patientData, config);
    return response.data;
  } catch (error) {
    console.error('Error in Update patient:', error);


    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      console.error('Response Data:', responseData);
    }

    throw error; 
  }
};


const cancelPatientAPI = async (token: any, patientData: any,patientId: number,) => {


  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    const response = await axios.patch(`${MY_SERVERGLOBAL}patients/${patientId}/cancel/`, patientData, config);

    return response.data;
  } catch (error) {
    console.error('Error in Update patient:', error);


    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      console.error('Response Data:', responseData);
    }

    throw error;
  }
};

export { getPatient, createPatient, updatePaitentAPI,cancelPatientAPI };