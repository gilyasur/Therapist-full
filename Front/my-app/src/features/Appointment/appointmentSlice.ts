import {  createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { createAppointmentAPI, getAppointments, updateAppointmentAPI } from './appointmentAPI ';
import { toast } from 'react-toastify';

export interface IAppointment {
  id: number;
  occurrence_date: String;
  time_of_day: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  therapist: {
    id: any;
  };
  patient: {
    id: number
    first_name: string;
    last_name : string;
    email : string;
    phone_number: string;
    date_of_birth : string
    address : string;
    created_at: string;
    updated_at : string;
    day_of_week: string;
    recurring_frequency: string;
    canceled: string;
    cancellation_reason: string;
    price:number ;
  };
}

export interface IAppointmentState {
  appointments: IAppointment[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
interface InewAppointment {
  id: number;
  occurrence_date: string
  patient:string
  time_of_day:string
  therapist:string
  notes:string
}

const initialState: IAppointmentState = {
  appointments: [],
  status: 'idle',
  error: null,
};



export const fetchAppointments = createAsyncThunk<IAppointment[], string>(
  "appointments/fetchAppointments",
  async (token) => {    
    if (!token) {
      throw new Error("Token not found");
    }
    try{

    const response = (await getAppointments(token))
    return response; 
  }catch (error) {
    console.log("error in fetch Appointments", error);
    throw error
    
  }
}

);

export const addAppointments = createAsyncThunk<InewAppointment, { token: string, appointmentData: InewAppointment }>(
  'appointments/addAppointments',
  async ({ token, appointmentData }) => {
    try {
      const response = await createAppointmentAPI(token, appointmentData);
      return response;
    } catch (error) {
      console.error('Error in addAppointment:', error);
      throw error;
    }
  }
);

export const updateAppointment = createAsyncThunk<IAppointment, { token: string, appointmentData: IAppointment }>(
  'patients/updPatient',
  async ({ token, appointmentData }) => {
    try {
      const response = await updateAppointmentAPI(token, appointmentData);
      return response;
    } catch (error) {
      console.error('Error in update patient:', error);
      throw error;
    }
  }
);

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {

        state.status = 'succeeded';
        state.appointments = action.payload; 
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        const updatedAppointment = action.payload; // Updated patient data received from action payload
        const existingAppointmentIndex = state.appointments.findIndex(appointment => appointment.id === action.payload.id);
      
        if (existingAppointmentIndex !== -1) {
          // If the updated patient already exists in the state, replace it with the updated data
          state.appointments[existingAppointmentIndex] = updatedAppointment;
        } else {
          // If the updated patient doesn't exist in the state, add it
          state.appointments.push(updatedAppointment);

        }
        state.status = 'succeeded';
        toast.success('Patient Updated!')
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        console.log('updappointment.rejected');
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const selectAppointments = (state: RootState) => state.appointment.appointments;
export const selectAppointmentsStatus = (state: RootState) => state.appointment.status;
export const selectAppointmentsError = (state: RootState) => state.appointment.error;


export default appointmentsSlice.reducer;
