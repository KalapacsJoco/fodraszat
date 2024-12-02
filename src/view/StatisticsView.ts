import { APPOINTMENTS_URL, HAIRDRESSERS_URL } from "../components/apiConfig.js";

type Appointment = {
  hairdresser_id: string;
  appointment_date: string;
};

type Hairdresser = {
  id: number;
  name: string;
};

const statisticAppointments = document.getElementById(
  "statistic-appointments"
) as HTMLDivElement;

export async function getHairdresserStatistics() {
  try {
    const hairdressersResponse = await fetch(HAIRDRESSERS_URL);
    const hairdressers: Hairdresser[] = await hairdressersResponse.json();

    const appointmentsResponse = await fetch(APPOINTMENTS_URL);
    const appointments: Appointment[] = await appointmentsResponse.json();

    // Szűrés az aktuális hónapra és évre
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0-indexelt (január = 0)
    const currentYear = currentDate.getFullYear();

    const filteredAppointments = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.appointment_date);
      return (
        appointmentDate.getMonth() === currentMonth &&
        appointmentDate.getFullYear() === currentYear
      );
    });

    const totalAppointments = filteredAppointments.length;

    const hairdresserStats = hairdressers.map((hairdresser) => {
      const hairdresserAppointments = filteredAppointments.filter(
        (appointment) =>
          appointment.hairdresser_id === hairdresser.id.toString()
      ).length;
      const percentage = Math.round(
        (hairdresserAppointments / totalAppointments) * 100
      );
      return {
        name: hairdresser.name,
        appointments: hairdresserAppointments,
        percentage: percentage,
      };
    });

    hairdresserStats.sort((a, b) => b.appointments - a.appointments);

    displayHairdresserStatistics(hairdresserStats);
  } catch (error) {
    console.error("Hiba történt az adatok lekérése során:", error);
  }
}

function displayHairdresserStatistics(
  stats: { name: string; appointments: number; percentage: number }[]
) {
  if (statisticAppointments) {
    statisticAppointments.innerHTML = ""; // Törli az előző statisztikákat

    stats.forEach((stat) => {
      const hairdresserDiv = document.createElement("div");
      hairdresserDiv.textContent = `${stat.name}: ${stat.appointments}`;

      const lineDiv = document.createElement("div");
      lineDiv.style.width = `${stat.percentage * 2}px`;
      lineDiv.style.height = "10px";
      lineDiv.style.backgroundColor = "#0d47a1";

      hairdresserDiv.appendChild(lineDiv);
      statisticAppointments.appendChild(hairdresserDiv);
    });
  }
}
