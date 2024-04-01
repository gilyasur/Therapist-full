import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { MantineProvider } from '@mantine/core'; // Import MantineProvider
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Patient } from './features/patients/Patient';
import Appointment from './features/Appointment/Appointment';
import { MainPreSite } from './features/Presite/MainPreSite';
import { Dashboard } from './features/Dashboard/Dashboard';
import { Profile } from './features/Profile/Profile'; 
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { Register } from './features/Presite/register/Register';
import { EditProfile } from './features/Profile/EditProfile';
import ResetPass from './features/Presite/forgotPass/ResetPass';
import UnderConstruction from './features/Dashboard/UnderConstruction';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <MantineProvider>
        <BrowserRouter>
        <Routes>
  <Route path="/" element={<MainPreSite />} />
  <Route path="/App/*" element={<App />}>
    <Route path="Dashboard">
      <Route index element={<Outlet />} />
      <Route path="profile" element={<Profile />} />
      <Route path="patients" element={<Patient />} />
      <Route path="appointments" element={<Appointment />} />
      <Route path="reports"  element={<UnderConstruction/>} />
    </Route>
    <Route path="profile" element={<Profile />} />
    <Route path="editProfile" element={<EditProfile />} />
    <Route index element={<Navigate to="Dashboard" />} />
  </Route>
  <Route path="register" element={<Register />} />
  <Route path="reset-password/:userName/:userID" element={<ResetPass />} />
  <Route path="*" element={<p>There's nothing here: 404!</p>} />
</Routes>
        </BrowserRouter>
      </MantineProvider>
    </Provider>
  </React.StrictMode>,
);

reportWebVitals();
