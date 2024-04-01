import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { toast } from 'react-toastify';
import {  cancelPatientAPI, createPatient, getPatient, updatePaitentAPI } from './patientAPI'; 


export interface Ipatient {
  id:number;
  therapist: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  address: string;
  price:string;
  day_of_week:string;
  canceled:boolean;
}

export interface IpatientState {
  patients: Ipatient[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: IpatientState = {
  patients: [],
  status: 'idle',
  error: null,
};

export const fetchPatients = createAsyncThunk<Ipatient[], string>(
  'patients/fetchPatients',
  async (token) => {
    if (!token) {
      throw new Error('Token not found');
    }

    try {
      const response = await getPatient(token);
      return response;
    } catch (error) {
      console.error('Error in fetchPatients:', error);
      throw error;
    }
  }
);




export const addPatient = createAsyncThunk<Ipatient, { token: string, patientData: Ipatient }>(
  'patients/addPatient',
  async ({ token, patientData }) => {
    try {
      const response = await createPatient(token, patientData);
      return response;
    } catch (error) {
      console.error('Error in addPatient:', error);
      throw error;
    }
  }
);
export const cancelPatientAsync = createAsyncThunk<Ipatient, { token: string, patientData: {  canceled: boolean },patientId: number, }>(
  'patients/cancelPatient',
  async ({ token, patientData,patientId }) => {
    try {
      const response = await cancelPatientAPI(token, patientData,patientId);
      return response;
    } catch (error) {
      console.error('Error in cancelPatient:', error);
      throw error;
    }
  }
);

export const updatePatient = createAsyncThunk<Ipatient, { token: string, patientData: Ipatient }>(
  'patients/updPatient',
  async ({ token, patientData }) => {
    try {
      const response = await updatePaitentAPI(token, patientData);
      return response;
    } catch (error) {
      console.error('Error in update patient:', error);
      throw error;
    }
  }
);

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.patients = action.payload.map((patient) => ({
          ...patient,
          therapist: Number(patient.therapist),
        }));
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        console.log('fetchPatients.rejected');
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(addPatient.fulfilled, (state, action) => {
        console.log('addPatient.fulfilled');
        state.status = 'succeeded';
        state.patients.push(action.payload); 
        toast.success('Patient Added!')
      })
      .addCase(addPatient.rejected, (state, action) => {
        console.log('addPatient.rejected');
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        const updatedPatient = action.payload; 
        const existingPatientIndex = state.patients.findIndex(patient => patient.id === updatedPatient.id);
      
        if (existingPatientIndex !== -1) {

          state.patients[existingPatientIndex] = updatedPatient;
        } else {
         
          state.patients.push(updatedPatient);
        }
        state.status = 'succeeded'
        toast.success('Patient Updated!')
      })
      
      .addCase(updatePatient.rejected, (state, action) => {
        console.log('updpatient.rejected');
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(cancelPatientAsync.fulfilled, (state, action) => {
        const cancelPatientAsync = action.payload; 
        const existingPatientIndex = state.patients.findIndex(patient => patient.id === cancelPatientAsync.id);
      
        if (existingPatientIndex !== -1) {
          state.patients[existingPatientIndex] = cancelPatientAsync;
        } else {
          state.patients.push(cancelPatientAsync);
        }
        state.status = 'succeeded';
        toast.success('Patient Canceled!')
      })
     
  },
});

export const selectPatients = (state: RootState) => state.patient.patients;
export const selectPatientsStatus = (state: RootState) => state.patient.status;
export const selectPatientsError = (state: RootState) => state.patient.error;

export default patientSlice.reducer;
