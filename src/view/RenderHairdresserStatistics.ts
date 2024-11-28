import { APPOINTMENTS_URL } from "../components/apiConfig.js";

export async function renderHairdresserStatistics(hairdresserId: number) {
  const statisticContainer = document.getElementById("statistic-days");
  if (!statisticContainer) return;

  statisticContainer.innerHTML = ""; 

  const response = await fetch(APPOINTMENTS_URL);
  const appointments = await response.json();

  const filteredAppointments = appointments.filter(
    (appointment: { hairdresser_id: string }) => appointment.hairdresser_id === hairdresserId.toString()
  );

  const dailyAppointmentsCount: { [key: number]: number } = {};
  for (let day = 1; day <= 30; day++) {
    dailyAppointmentsCount[day] = 0;
  }

  filteredAppointments.forEach((appointment: { appointment_date: string }) => {
    const date = new Date(appointment.appointment_date);
    const day = date.getDate(); // Az appointment dátumának napja
    if (day >= 1 && day <= 30) {
      dailyAppointmentsCount[day]++;
    }
  });

  for (let day = 1; day <= 30; day++) {
    const dayColumn = document.createElement("div");

    dayColumn.style.display = "inline-block";
    dayColumn.style.width = "15px";
    dayColumn.style.marginRight = "10px";
    dayColumn.style.verticalAlign = "bottom";
    dayColumn.style.textAlign = "center"; 

    const appointmentLine = document.createElement("div");
    appointmentLine.style.height = `${dailyAppointmentsCount[day] * 10}px`; 
    appointmentLine.style.width = "100%";
    appointmentLine.style.backgroundColor = (dailyAppointmentsCount[day] < 8) ? "#0d47a1" : "#CC0000";

    const dayLabel = document.createElement("div");
    dayLabel.textContent = `${day}`;
    dayLabel.style.marginTop = "5px"; 
    dayLabel.style.fontSize = "12px"; 

    dayColumn.appendChild(appointmentLine);
    dayColumn.appendChild(dayLabel);

    statisticContainer.appendChild(dayColumn);
  }
}
