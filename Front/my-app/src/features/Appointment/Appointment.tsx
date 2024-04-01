import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import {
  fetchAppointments,
  selectAppointments,
  selectAppointmentsStatus,
  selectAppointmentsError,
  addAppointments,
  updateAppointment,
} from "./appointmentSlice";
import {
  selectLogged,
  selectToken,
} from "../Presite/login/loginSlice";
import { IAppointment } from "./appointmentSlice";
import {
  Button,
  Modal,
  Select,
  Table,
  Textarea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { fetchPatients, selectPatients } from "../patients/patientSlice";
import { TimeInput } from "@mantine/dates";
import { useNavigate } from "react-router-dom";
import { IconPencil } from "@tabler/icons-react";
import { Loader } from '@mantine/core';


interface IPatient {
  id: number;
  first_name: string;
  last_name: string;
}
interface InewAppointment {
  id: number;
  occurrence_date: string;
  patient: string;
  time_of_day: string;
  therapist: string;
  notes: string;
}
const Appointment: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<any, void, AnyAction>>(); 
  const [
    addAppointmentOpened,
    { open: openAppointment, close: closeAppointment },
  ] = useDisclosure(false);
  const patients = useSelector(selectPatients);
  const [editAppointment, { open: openeditAppointment, close: closeeditAppointment }] = useDisclosure(false);

  const appointments = useSelector(selectAppointments);
  const status = useSelector(selectAppointmentsStatus);
  const error = useSelector(selectAppointmentsError);
  const navigate = useNavigate();
  const token = useSelector(selectToken);
  const logged = useSelector(selectLogged);
  const [selectedAppointment, setselectedAppointment] =
    useState<IAppointment | null>(null);
 
  const [showNotesIndex, setShowNotesIndex] = useState<number | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null
  );
  const [newappointmentData, setnewappointmentData] = useState<InewAppointment>(
    {
      id: 0,
      occurrence_date: "",
      time_of_day: "",
      notes: "",
      therapist: "1",
      patient: "",
    }
  );

  const [editappointmentData, seteditappointmentData] = useState<IAppointment>({
    id: selectedAppointment?.id || 0,
    occurrence_date: selectedAppointment?.occurrence_date || "",
    time_of_day: selectedAppointment?.time_of_day || "",
    notes: selectedAppointment?.notes || "",
    created_at: selectedAppointment?.created_at || "",
    updated_at: selectedAppointment?.updated_at || "",
    therapist: selectedAppointment?.therapist || { id: 1 },
    patient: {
      id: selectedAppointment?.patient?.id || 0,
      first_name: selectedAppointment?.patient?.first_name || "",
      last_name: selectedAppointment?.patient?.last_name || "",
      email: selectedAppointment?.patient?.email || "",
      phone_number: selectedAppointment?.patient?.phone_number || "",
      date_of_birth: selectedAppointment?.patient?.date_of_birth || "",
      address: selectedAppointment?.patient?.address || "",
      created_at: selectedAppointment?.patient?.created_at || "",
      updated_at: selectedAppointment?.patient?.updated_at || "",
      day_of_week: selectedAppointment?.patient?.day_of_week || "",
      recurring_frequency:
        selectedAppointment?.patient?.recurring_frequency || "",
      canceled: selectedAppointment?.patient?.canceled || "",
      cancellation_reason:
        selectedAppointment?.patient?.cancellation_reason || "",
      price: selectedAppointment?.patient?.price || 0,
    },
  });
  useEffect(() => {
    if (token) {
      dispatch(fetchAppointments(token));
      dispatch(fetchPatients(token));
    } else {
      navigate("/");
    }
  }, [dispatch, token]);

  const handleAddAppointment = () => {
    const patientId = newappointmentData.patient;

    dispatch(
      addAppointments({
        token,
        appointmentData: { ...newappointmentData, patient: patientId },
      })
    );

    setnewappointmentData({
      id: 0,
      occurrence_date: "",
      time_of_day: "",
      notes: "",
      therapist: "1",
      patient: "",
    });
    closeAppointment();
  };

  const toggleNotes = (index: number) => {
    setShowNotesIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handlePatientChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPatientId(Number(event.target.value));
  };

  const handleOpenEditAppointment = (appointment: IAppointment) => {
    setselectedAppointment(appointment);
    seteditappointmentData({ ...appointment }); 
    openeditAppointment();    
  };

  const handleEditAppointment = () => {
    if (!selectedAppointment) {
      return;
    }
    const updatedAppointmentData = {
      ...selectAppointments,
      ...editappointmentData 
    };
    dispatch(updateAppointment({ token, appointmentData: updatedAppointmentData }));
    closeeditAppointment(); 
  };

  function convertToHoursAndMinutes(timeString:any) {
    // Split the time string into hours and minutes
    const [hours, minutes] = timeString.split(':').map(Number);
  
    // Return formatted time
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  }
  
  const patientOptions = patients.map((patient) => ({
    label: `${patient.first_name} ${patient.last_name}`,
    value: String(patient.id),
  }));

  if (status === "loading") {
    return <div> <Loader color="blue" /></div>;
  }

  if (status === "failed") {
    return <div>
    Error: Please Login :{error}
    <a href="/" rel="noopener noreferrer">
      Click here to login
    </a>
  </div>;
  }


  const uniquePatients: IPatient[] = Array.from(
    new Set(appointments.map((appointment) => appointment.patient.id))
  )
    .map(
      (patientId) =>
        appointments.find((appointment) => appointment.patient.id === patientId)
          ?.patient
    )
    .filter(Boolean) as IPatient[];

  // Filter appointments based on the selected patient
  const filteredAppointments = selectedPatientId
    ? appointments.filter(
        (appointment) => appointment.patient.id === selectedPatientId
      )
    : appointments;

  // Sort the filteredAppointments by date
  const sortedAppointments = filteredAppointments
    .slice()
    .sort((a: IAppointment, b: IAppointment) => {
      const dateA =
        typeof a.occurrence_date === "string" ? a.occurrence_date : "";
      const dateB =
        typeof b.occurrence_date === "string" ? b.occurrence_date : "";
      return dateA.localeCompare(dateB); // Compare the strings directly
    });

  const ths = (
    <Table.Tr>
      <Table.Th>Patient Name</Table.Th>
      <Table.Th>Date of Appointment</Table.Th>
      <Table.Th>Time of Day</Table.Th>

      <Table.Th>Notes</Table.Th>
      <Table.Th>Action</Table.Th>
    </Table.Tr>
  );

  const rows = sortedAppointments.map(
    (appointment: IAppointment, index: number) => (
      <Table.Tr key={index}>
        <Table.Td style={{ textAlign: "left" }}>
          {appointment.patient.first_name} {appointment.patient.last_name}
        </Table.Td>
        <Table.Td style={{ textAlign: "left" }}>
  {new Date(String(appointment.occurrence_date)).toLocaleDateString('en-GB')}
</Table.Td>


        <Table.Td style={{ textAlign: "left" }}>
  {convertToHoursAndMinutes(appointment.time_of_day)}
</Table.Td>

        <Table.Td style={{ textAlign: "left" }}>
          <button onClick={() => toggleNotes(index)}>
            {showNotesIndex === index ? "Hide Notes" : "Show Notes"}
          </button>
          {showNotesIndex === index && (
            <div>
              <p>Notes: {appointment.notes}</p>
            </div>
          )}
           
        </Table.Td>
        <Table.Td>
          <div style={{borderRadius:"5px"}}>
        <Button
  style={{
    borderRadius: "60px",
    border: "2px solid",
    background: '#456A71',
    color: "white",
    cursor: 'pointer',
    marginLeft: '0'
  }}
  onClick={() => handleOpenEditAppointment(appointment)}
  >
  <IconPencil />
</Button>
<Modal opened={editAppointment} onClose={closeeditAppointment} withCloseButton={false}>
  <div>
    {selectedAppointment && (
      <>
        <TimeInput
  label="time of appointment"
  placeholder={selectedAppointment.time_of_day}
  value={editappointmentData.time_of_day}
  onChange={(e) => seteditappointmentData({ ...editappointmentData, time_of_day: e.target.value })} 
/>

<input
  type="date"
  placeholder={editappointmentData.occurrence_date.toString()} 
  value={editappointmentData.occurrence_date.toString()} 
  onChange={(e) =>
    seteditappointmentData({
      ...editappointmentData,
      occurrence_date: e.target.value
    })
  }
/>
<br/>
        <Button onClick={handleEditAppointment}>Save Changes</Button>
      </>
    )}
  </div>
</Modal>
</div>
</Table.Td>
      </Table.Tr>
    )
  );

  return (
    <div style={{ textAlign: "left" }}>
      {logged ? (
        <>
          <h1 style={{ textAlign: "center" }}>Appointments</h1>
          <div>
            <Modal
              opened={addAppointmentOpened}
              onClose={closeAppointment}
              title="Add New appointment"
              centered
            >
              <div>
                <Select
                  label="Select a Patient"
                  placeholder="Choose from List"
                  data={patientOptions}
                  value={newappointmentData.patient} 
                  onChange={(value: string | null) => {
                    if (value !== null) {
                      // Update occurrence_date when the selection changes
                      setnewappointmentData({
                        ...newappointmentData,
                        patient: value,
                      });
                    }
                  }}
                />

                <br />
                <span>Date of appointment</span>
                <br/>
                <input
                
                  type="date"
                  placeholder="YYYY-MM-DD"
                  value={newappointmentData.occurrence_date.valueOf()} 
                  onChange={(e) =>
                    setnewappointmentData({
                      ...newappointmentData,
                      occurrence_date: e.target.value,
                    })
                  }
                />
                <br></br>

                <TimeInput

                  description="appointment time "
                  placeholder="appointment time"
                  value={newappointmentData.time_of_day}
                  onChange={(e) =>
                    setnewappointmentData({
                      ...newappointmentData,
                      time_of_day: e.target.value,
                    })
                  }
                />

                <Textarea
                  label="Notes"
                  placeholder="Appointment Notes"
                  autosize
                  minRows={2}
                  maxRows={4}
                  value={newappointmentData.notes || ""}
                  onChange={(e) =>
                    setnewappointmentData({
                      ...newappointmentData,
                      notes: e.target.value,
                    })
                  }
                />

                <button
                  onClick={handleAddAppointment}
                  style={{ paddingTop: "2px" }}
                >
                  Add Appointment
                </button>
              </div>
            </Modal>
          </div>
          <Button onClick={openAppointment} color="#2F4858">
            Add New Appointment
          </Button>
          <label htmlFor="patientSelect">Filter by Patient:</label>
          <select id="patientSelect" onChange={handlePatientChange}>
            <option value="">All Patients</option>
            {uniquePatients.map((patient, index) => (
              <option key={index} value={patient.id}>
                {patient.first_name} {patient.last_name}
              </option>
            ))}
          </select>

          {sortedAppointments && sortedAppointments.length > 0 ? (
            <Table
              striped
              highlightOnHover
              withTableBorder
              withColumnBorders
              withRowBorders={false}
              stickyHeader
              stickyHeaderOffset={60}
            >
              <Table.Thead>{ths}</Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          ) : (
            <div>No appointments available</div>
          )}
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Appointment;
