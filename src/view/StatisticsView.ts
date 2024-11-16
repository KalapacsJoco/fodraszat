import { APPOINTMENTS_URL, HAIRDRESSERS_URL } from "../components/apiConfig.js";
type Appointment = {
    hairdresser_id: string;
    appointment_date: string;
}
type Hairdresser = {
    id: number;
    name: string;
  }

const statisticAppointments = document.getElementById("statistic-appointments") as HTMLDivElement;

export async function getHairdresserStatistics() {
  try {
    const hairdressersResponse = await fetch(HAIRDRESSERS_URL);
    const hairdressers: Hairdresser[] = await hairdressersResponse.json();

    const appointmentsResponse = await fetch(APPOINTMENTS_URL);
    const appointments: Appointment[] = await appointmentsResponse.json();

    const totalAppointments = appointments.length; 

    const hairdresserStats = hairdressers.map(hairdresser => {
      const hairdresserAppointments = appointments.filter(appointment => appointment.hairdresser_id === hairdresser.id.toString()).length;
      const percentage = Math.round((hairdresserAppointments / totalAppointments) * 100);
      return {
        name: hairdresser.name,
        appointments: hairdresserAppointments,
        percentage: percentage,
      };
    });
    hairdresserStats.sort((a, b) => b.appointments - a.appointments);

    displayHairdresserStatistics(hairdresserStats);

  } catch (error) {
    console.error('Hiba történt az adatok lekérése során:', error);
  }
}

function displayHairdresserStatistics(stats: { name: string, appointments: number, percentage: number }[]) {
  if (statisticAppointments) {
    statisticAppointments.innerHTML = ''; 

    stats.forEach(stat => {
      const hairdresserDiv = document.createElement('div');
      hairdresserDiv.textContent = `${stat.name}: ${stat.appointments}`;

      const lineDiv = document.createElement('div');
      lineDiv.style.width = `${stat.percentage * 10}px`;
      lineDiv.style.height = '10px';
      lineDiv.style.backgroundColor = '#0d47a1'; 

      hairdresserDiv.appendChild(lineDiv);
      statisticAppointments.appendChild(hairdresserDiv);
    });
  }
}
