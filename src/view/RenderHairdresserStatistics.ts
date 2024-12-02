import { APPOINTMENTS_URL } from "../components/apiConfig.js";

export async function renderHairdresserStatistics(hairdresserId: number) {
  const statisticContainer = document.getElementById("statistic-days");
  if (!statisticContainer) return;

  statisticContainer.innerHTML = ""; // Törli az előző statisztikákat

  const response = await fetch(APPOINTMENTS_URL);
  const appointments = await response.json();

  // Aktuális hónap és év lekérése
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-indexelt (január = 0)
  const currentYear = currentDate.getFullYear();

  // Szűrés a kiválasztott fodrászra és az aktuális hónapra
  const filteredAppointments = appointments.filter(
    (appointment: { hairdresser_id: string; appointment_date: string }) => {
      const appointmentDate = new Date(appointment.appointment_date);
      return (
        appointment.hairdresser_id === hairdresserId.toString() &&
        appointmentDate.getMonth() === currentMonth &&
        appointmentDate.getFullYear() === currentYear
      );
    }
  );

  // Napi foglalások számlálása
  const dailyAppointmentsCount: { [key: number]: number } = {};
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Aktuális hónap napjainak száma

  for (let day = 1; day <= daysInMonth; day++) {
    dailyAppointmentsCount[day] = 0;
  }

  filteredAppointments.forEach((appointment: { appointment_date: string }) => {
    const date = new Date(appointment.appointment_date);
    const day = date.getDate(); // Az appointment dátumának napja
    if (day >= 1 && day <= daysInMonth) {
      dailyAppointmentsCount[day]++;
    }
  });

  // Statisztikák megjelenítése
  for (let day = 1; day <= daysInMonth; day++) {
    const dayColumn = document.createElement("div");

    dayColumn.style.display = "inline-block";
    dayColumn.style.width = "15px";
    dayColumn.style.marginRight = "10px";
    dayColumn.style.verticalAlign = "bottom";
    dayColumn.style.textAlign = "center"; 

    const appointmentLine = document.createElement("div");
    appointmentLine.style.height = `${dailyAppointmentsCount[day] * 10}px`; 
    appointmentLine.style.width = "100%";
    appointmentLine.style.backgroundColor = dailyAppointmentsCount[day] < 8 ? "#0d47a1" : "#CC0000";

    const dayLabel = document.createElement("div");
    dayLabel.textContent = `${day}`;
    dayLabel.style.marginTop = "5px"; 
    dayLabel.style.fontSize = "12px"; 

    dayColumn.appendChild(appointmentLine);
    dayColumn.appendChild(dayLabel);

    statisticContainer.appendChild(dayColumn);
  }
}
