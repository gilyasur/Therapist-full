import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, TextInput, NumberInput, Table } from '@mantine/core';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import {  selectToken } from "../Presite/login/loginSlice";
import { fetchPatients, selectPatients, selectPatientsError, selectPatientsStatus, addPatient, Ipatient,  updatePatient, cancelPatientAsync } from "./patientSlice";
import styles from "../patients/patient.module.css"
import { fetchAppointments, selectAppointments } from '../Appointment/appointmentSlice';
import {useNavigate } from 'react-router-dom';
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { IconPencil } from "@tabler/icons-react";
import { MdCancel } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShekelSign } from '@fortawesome/free-solid-svg-icons';
import { Loader } from '@mantine/core';


export function Patient() {
  const [addPatientOpened, { open: openPatient, close: closePatient }] = useDisclosure(false);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Ipatient | null>(null); 
  const [showAppointments, { open: openAppointments, close: closeAppointments }] = useDisclosure(false);
  const [editPatient, { open: openeditPatient, close: closeeditPatient }] = useDisclosure(false);
  const dispatch = useDispatch<ThunkDispatch<any, void, AnyAction>>();
  const patients = useSelector(selectPatients);
  const status = useSelector(selectPatientsStatus);
  const error = useSelector(selectPatientsError);
  const token = useSelector(selectToken);
  const appointments = useSelector(selectAppointments);
  const filteredAppointments = appointments.filter(appointment => appointment.patient && appointment.patient.id === selectedPatientId);
  const navigate = useNavigate();
  const notifyaddPatient = () => toast("Patient Added!");
  const [errorInput, seterrorInput] = useState('');

  useEffect(() => {
    if (token) {
      dispatch(fetchPatients(token));
      dispatch(fetchAppointments(token));
    } else {
      navigate('/');
    }
  }, [dispatch, token]);

  const [newPatientData, setNewPatientData] = useState<Ipatient>({
    id: 0,
    therapist: 2, 
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    date_of_birth: "",
    address: "",
    price: "10",
    day_of_week: "",
    canceled:false,  

  });
  const [editPatientData, seteditPatientData] = useState<Ipatient>({
    id: selectedPatient?.id || 0,
    therapist: selectedPatient?.therapist || 1, 
    first_name: selectedPatient?.first_name || "",
    last_name: selectedPatient?.last_name || "",
    email: selectedPatient?.email || "",
    phone_number: selectedPatient?.phone_number || "",
    date_of_birth: selectedPatient?.date_of_birth || "",
    address: selectedPatient?.address || "",
    price: selectedPatient?.price || "",
    day_of_week: selectedPatient?.day_of_week || "",
    canceled:selectedPatient?.canceled|| false,
  });



  const handleAddPatient = () => {
    if (!newPatientData.first_name || !newPatientData.last_name || !newPatientData.date_of_birth || !newPatientData.email) {
      seterrorInput('Please fill out all required fields.');
      return;
    }
  
    dispatch(addPatient({ token, patientData: newPatientData }));
    setNewPatientData({
      id: 0,
      therapist: 0,
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      date_of_birth: "", 
      address: "",
      price: "",
      day_of_week: "",
      canceled: false,
    });
    closePatient(); 
    notifyaddPatient();
  };
  

  const handleOpenAppointments = (id: number) => {
    setSelectedPatientId(id);
    openAppointments();
  };
  const handleOpenEditPatient = (patient: Ipatient) => {
    setSelectedPatient(patient);
    seteditPatientData({ ...patient }); 
    openeditPatient();    
  };
  const handleEditPatient = () => {
    if (!selectedPatient) {
      
      return;
    }
    
    
    const updatedPatientData = {
      ...selectedPatient, 
      ...editPatientData 
    };
  

    dispatch(updatePatient({ token, patientData: updatedPatientData }));
    closeeditPatient(); 
    
  };
  
  
  const handleCancelPatient = (patientId: any) => {
    const confirmed = window.confirm('Are you sure you want to cancel this patient?');
  
    if (confirmed) {
      const cancelData = {
        canceled: true
      };
  
      dispatch(cancelPatientAsync({ token, patientData: cancelData, patientId: patientId }));
    }
  }
  
  function convertToHoursAndMinutes(timeString:any) {
    const [hours, minutes] = timeString.split(':').map(Number);
  
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  }
  

  
  if (status === "loading") {
    return <div><Loader color="blue" /></div>
  }

  if (status === "failed") {
    return  <div>
    Error: Please Login :{error}
    <a href="/" rel="noopener noreferrer">
      Click here to login
    </a>
  </div>;
  }

  return (
    <>
    <div>
    <h2 style={{ textAlign: "center" }}>Patients</h2>
    <Modal opened={addPatientOpened} onClose={closePatient} title="Add New Patient" centered>
      <div>
      <TextInput
          withAsterisk
          description={<span>First Name - <strong style={{color:"red"}}>Required</strong></span>}
          placeholder="Patient First Name"
          value={newPatientData.first_name}
          onChange={(e) => setNewPatientData({ ...newPatientData, first_name: e.target.value })}
        />
        <TextInput
          withAsterisk
          description={<span>Last Name - <strong style={{color:"red"}}>Required</strong></span>}
          placeholder="Patient Last Name"
          value={newPatientData.last_name}
          onChange={(e) => setNewPatientData({ ...newPatientData, last_name: e.target.value })}
        />
     <span style={{color:"#868e96", fontSize:"0.8rem"}}>Patient DOB : <strong style={{color:"red"}}>Required</strong> </span>
        <br/>
        <input type="date"  placeholder="Date of Birth" value={newPatientData.date_of_birth} onChange={(e) => setNewPatientData({ ...newPatientData, date_of_birth: e.target.value })} />
        <TextInput
          withAsterisk
          description={<span>Email - <strong style={{color:"red"}}>Required</strong></span>}
          placeholder="Email"
          value={newPatientData.email}
          onChange={(e) => setNewPatientData({ ...newPatientData, email: e.target.value })} 
        />
        <TextInput
  withAsterisk
  description="Telephone Number"
  placeholder="Patient Number"
  value={newPatientData.phone_number}
  onChange={(e) => setNewPatientData({ ...newPatientData, phone_number: e.target.value })}
/>

<TextInput
  withAsterisk
  description="Address"
  placeholder="Patient Address"
  value={newPatientData.address}
  onChange={(e) => setNewPatientData({ ...newPatientData, address: e.target.value })}
/>
<NumberInput
  label="Price"
  placeholder=""
  allowDecimal={false}
  value={newPatientData.price}
  onChange={(val) => {
    const numericValue = typeof val === 'string' ? parseFloat(val) : val;
    setNewPatientData({ ...newPatientData, price: numericValue.toString() || '0' });
  }}
/>

        {/* Same for other fields */}
        <button onClick={handleAddPatient} style={{ paddingTop: "2px" }}>Add Patient</button>
        {errorInput && <div style={{ color: 'red' }}>{errorInput}</div>}
      </div>
    </Modal>
    </div>
    <Modal opened={showAppointments} onClose={closeAppointments} title="Appointments" centered >
  <Table>
    <Table.Thead>
      <Table.Tr>
        <Table.Th>Date</Table.Th>
        <Table.Th>Time</Table.Th>
      </Table.Tr>
    </Table.Thead>
    <Table.Tbody>
      {filteredAppointments.map(appointment => (
        <Table.Tr key={appointment.id}>
          <Table.Td> {new Date(String(appointment.occurrence_date)).toLocaleDateString('en-GB')}</Table.Td>
          <Table.Td> {convertToHoursAndMinutes(appointment.time_of_day)}</Table.Td>
        </Table.Tr>
      ))}
    </Table.Tbody>
  </Table>
</Modal>


    <div className={styles.navBarPatient} style={{display:"flex"}}>
      <Button onClick={openPatient} style={{"marginBottom":"10px", marginLeft:"10px"}} color="#2F4858" >Add New Patient</Button>
    </div>
    <Modal opened={editPatient} onClose={closeeditPatient} withCloseButton={false}>
  <div>
    {selectedPatient && (
      <>
        <TextInput
          label="First Name"
          placeholder={selectedPatient.first_name}
          value={editPatientData.first_name}
          onChange={(e) => seteditPatientData({ ...editPatientData, first_name: e.target.value })} 
        />
        <TextInput
          label="Last Name"
          placeholder={selectedPatient.last_name}
          value={editPatientData.last_name}
          onChange={(e) => seteditPatientData({ ...editPatientData, last_name: e.target.value })} 
        />
        <Button onClick={handleEditPatient}>Save Changes</Button>

      </>
    )}
  </div>
</Modal>

<div className={styles.patientCards}>
  {patients && patients.length > 0 ? (
    patients
      .filter((patient) => patient.canceled === false) 
      .map((patient, index) => (
        <div key={index} className={styles.patientCard}>
          <div className={styles.patientInfo}>
            <p className={styles.patientName}>
              Patient: {patient.first_name} {patient.last_name}
            </p>
            <p className={styles.patientDetail}>
              <span className={styles.label}>Email:</span> {patient.email}
            </p>
            <p className={styles.patientDetail}>
              <span className={styles.label}>Phone Number:</span> {patient.phone_number}
            </p>
            <p className={styles.patientDetail}>
              <span className={styles.label}>Date of Birth:</span> {patient.date_of_birth}
            </p>
            <p className={styles.patientDetail}>
              <span className={styles.label}>Address:</span> {patient.address}
            </p>
            <p className={styles.patientDetail}>
              <span className={styles.label}>Price:</span>  {patient.price} &nbsp;
              <FontAwesomeIcon icon={faShekelSign} size="2xs" />

            </p>
          
          </div>
          <div style={{display:"flex", justifyContent:"space-between"}} className={styles.actionsContainer}>
            <div className={styles.showAppointmentsButton} >
              <Button style={{width:"12rem"}} onClick={() => handleOpenAppointments(patient.id)} >Show Appointments</Button>
            </div>
            <div className={styles.speedDialContainer}>
              <Box sx={{ height: 50, transform: "translateZ(0px)", flexGrow: 1 }}>
                <SpeedDial
                  ariaLabel="SpeedDial"
                  sx={{ position: "absolute", bottom: 1, right: 16 }}
                  icon={<SpeedDialIcon />}
                >
                  {[
                    { icon: <MdCancel style={{ fontSize: '50px' }} />, name: "Cancel", action: () => handleCancelPatient(patient.id) },
                    { icon: <IconPencil />, name: "Edit", action: () => handleOpenEditPatient(patient) }
                  ].map((item, index) => (
                    <SpeedDialAction
                      key={index}
                      icon={item.icon}
                      tooltipTitle={item.name}
                      onClick={item.action}
                    />
                  ))}
                </SpeedDial>
              </Box>
            </div>
          </div>
          <hr />
        </div>
      ))
  ) : (
    <div>No appointments available</div>
  )}
</div>
<ToastContainer />

    </>
  );
}
