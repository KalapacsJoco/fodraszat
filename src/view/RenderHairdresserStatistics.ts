import { APPOINTMENTS_URL } from "../components/apiConfig.js";

export async function renderHairdresserStatistics(hairdresserId: number) {
  const statisticContainer = document.getElementById("statistic-days");
  if (!statisticContainer) return;

  statisticContainer.innerHTML = ""; // Törli az előző statisztikákat

  // Foglalások lekérése az API-ról
  const response = await fetch(APPOINTMENTS_URL);
  const appointments = await response.json();

  // Szűrés az adott fodrászhoz tartozó foglalásokra
  const filteredAppointments = appointments.filter(
    (appointment: { hairdresser_id: string }) => appointment.hairdresser_id === hairdresserId.toString()
  );

  // Napi foglalások összesítése
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

  // Grafikon létrehozása
  for (let day = 1; day <= 30; day++) {
    const dayColumn = document.createElement("div");
    // dayColumn.classList.add("columns");

    dayColumn.style.display = "inline-block";
    dayColumn.style.width = "15px";
    dayColumn.style.marginRight = "10px";
    dayColumn.style.verticalAlign = "bottom";
    dayColumn.style.textAlign = "center"; // Középre igazítás

    // Létrehozzuk a foglalások számának megfelelő vonalat
    const appointmentLine = document.createElement("div");
    appointmentLine.style.height = `${dailyAppointmentsCount[day] * 10}px`; // Magasság a foglalások száma alapján
    appointmentLine.style.width = "100%";
    appointmentLine.style.backgroundColor = (dailyAppointmentsCount[day] < 8) ? "blue" : "red";

    // Létrehozzuk a nap számát jelző elemet
    const dayLabel = document.createElement("div");
    dayLabel.textContent = `${day}`;
    dayLabel.style.marginTop = "5px"; // Kis távolság a vonal és a nap között
    dayLabel.style.fontSize = "12px"; // Kisebb betűméret a nap számához

    // Hozzáadjuk a vonalat és a nap számát az oszlophoz
    dayColumn.appendChild(appointmentLine);
    dayColumn.appendChild(dayLabel);

    statisticContainer.appendChild(dayColumn);
  }
}
