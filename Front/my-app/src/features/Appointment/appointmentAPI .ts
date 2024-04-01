// src/services/appointmentsApi.ts
import axios from 'axios';
import { MY_LOCALSERVER, MY_SERVERGLOBAL } from "../../VariablesGlob";

const MY_SERVER = 'https://theradash.onrender.com/appointments/';

const getAppointments = async (token:any) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  try {
    const response = await axios.get(`${MY_SERVERGLOBAL}appointments/`, config);

    
    return response.data;
  } catch (error) {
    console.error("Error in getAppointments:", error);
    throw error;
  }
};


const createAppointmentAPI = async (token: any, appointmentData: any) => {
  
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    const response = await axios.post(`${MY_SERVERGLOBAL}appointments/`, appointmentData, config);

    return response.data;
  } catch (error) {
    console.error('Error in createAppointment:', error);
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      console.error('Response Data:', responseData);
    }

    throw error; 
  }
};

const updateAppointmentAPI = async (token: any, appointmentData: any) => {
  let deletedPatientData; 
  const patientId = appointmentData.patient.id;

  // Save the patient data before deleting
  deletedPatientData = appointmentData.patient;

  // Add patient ID to the top level of the JSON object
  appointmentData.patient = patientId;

  // Delete the patient data
  delete appointmentData.patient;

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    const response = await axios.patch(`${MY_SERVERGLOBAL}appointments/${appointmentData.id}/`, appointmentData, config);
    delete response.data.patient
    // Push the deleted patient data to the JSON response
    response.data.patient = deletedPatientData;

    // Return the updated appointment data
    return response.data;
  } catch (error) {
    console.error('Error in updating appointment:', error);

    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      console.error('Response Data:', responseData);
    }

    throw error; 
  }
};




export { getAppointments, createAppointmentAPI, updateAppointmentAPI};
