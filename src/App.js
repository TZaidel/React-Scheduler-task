import { useState, useEffect } from "react";
import { db } from "./firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import Paper from "@mui/material/Paper";
import {
  ViewState,
  EditingState,
  IntegratedEditing,
} from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  DayView,
  WeekView,
  MonthView,
  Appointments,
  AppointmentTooltip,
  AppointmentForm,
  DateNavigator,
  DragDropProvider,
  TodayButton,
  Toolbar,
  ViewSwitcher,
  ConfirmationDialog,
} from "@devexpress/dx-react-scheduler-material-ui";

import {
  appointmentFormLocalizationMessages,
  configurationDialogLocalizationMessages,
} from "./localizationMessages";

export default function App() {
  const [appointments, setAppointments] = useState([]);

  const appointmentsRef = collection(db, "appointments");

  useEffect(() => {
    const getAppointments = async () => {
      const data = await getDocs(appointmentsRef);
      setAppointments(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          startDate: doc.data().startDate.toDate(),
          endDate: doc.data().endDate.toDate(),
        })),
      );
    };
    getAppointments();
  }, []);

  const commitChanges = async ({ added, changed, deleted }) => {
    if (added) {
      if (!added.title || added.title.trim() === "") {
        alert("wprowadź tytuł");
        return;
      }
      const docRef = await addDoc(appointmentsRef, {
        title: added.title,
        startDate: added.startDate,
        endDate: added.endDate,
      });
      setAppointments((prev) => [...prev, { ...added, id: docRef.id }]);
    }

    if (changed) {
      setAppointments((prev) =>
        prev.map((el) => (changed[el.id] ? { ...el, ...changed[el.id] } : el)),
      );
      for (const id in changed) {
        const appointmentDoc = doc(db, "appointments", id);
        await updateDoc(appointmentDoc, changed[id]);
      }
    }

    if (deleted !== undefined) {
      setAppointments((prev) => prev.filter((el) => el.id !== deleted));
      const appointmentDoc = doc(db, "appointments", deleted);
      await deleteDoc(appointmentDoc);
    }
  };

  return (
    <div>
      <Paper>
        <Scheduler locale="pl-PL" data={appointments} height={700}>
          <ViewState defaultCurrentViewName="Month" />
          <EditingState onCommitChanges={commitChanges} />
          <IntegratedEditing />
          <DayView displayName="Dzień" startDayHour={6} endDayHour={22} />
          <WeekView displayName="Tydzień" startDayHour={6} endDayHour={22} />
          <MonthView displayName="Miesiąc" />
          <Toolbar />
          <TodayButton />
          <DateNavigator />
          <ViewSwitcher />
          <Appointments />
          <DragDropProvider />
          <AppointmentTooltip showCloseButton showOpenButton />
          <AppointmentForm messages={appointmentFormLocalizationMessages} />
          <ConfirmationDialog
            messages={configurationDialogLocalizationMessages}
          />
        </Scheduler>
      </Paper>
    </div>
  );
}
