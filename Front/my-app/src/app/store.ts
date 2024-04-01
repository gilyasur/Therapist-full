import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import loginReducer from '../features/Presite/login/loginSlice';

import appointmentReducer from '../features/Appointment/appointmentSlice';
import patientReducer from '../features/patients/patientSlice';
import registerReducer from '../features/Presite/register/registerSlice';
import profileReducer from '../features/Profile/profileSlice';
import editedProfileImageReducer from '../features/Profile/profileSlice';

export const store = configureStore({
  
  reducer: {
    login: loginReducer,
    appointment: appointmentReducer,
    patient:patientReducer,
    register:registerReducer,
    profile:profileReducer,
    editedprofileImage: editedProfileImageReducer,

  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
