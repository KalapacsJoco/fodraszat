import { getHairdressers } from "./HairdresserController.js";
import { getAppointments, checkIfBooked } from "./AppointmentController.js";
import { formatTime } from "../components/FormatTime.js";

export async function showModal(dayNumber: number, hairdresserId: number, year: number, month: string, day: string) {
  const modal = document.getElementById("appointment-modal") as HTMLElement;
  const appointmentGrid = document.getElementById("modal-appointment-grid") as HTMLElement;


  const hairdressers = await getHairdressers();
  const hairdresser = hairdressers.find(h => h.id === hairdresserId);

  if (hairdresser) {
    const workStart = parseInt(hairdresser.work_start_time.split(':')[0]) * 60;
    const workEnd = parseInt(hairdresser.work_end_time.split(':')[0]) * 60;

    const appointments = await getAppointments();
    const filteredAppointments = appointments.filter(appointment =>
      appointment.hairdresser_id === hairdresserId.toString() &&
      appointment.appointment_date.startsWith(`${year}-${month}-${day}`)
    );

    if (appointmentGrid) {
      appointmentGrid.innerHTML = ""; 
    }

    for (let time = workStart; time < workEnd; time += 30) {
      const timeSlot = document.createElement("div");
      timeSlot.classList.add("time-slot");

      const formattedTime = formatTime(time);
      timeSlot.textContent = formattedTime;

      const isBooked = checkIfBooked(filteredAppointments, hairdresserId, `${year}-${month}-${day}`, formattedTime);

      if (isBooked) {
        const appointmentDetails = filteredAppointments.find(appointment =>
          appointment.appointment_date.includes(formattedTime)
        );
        timeSlot.classList.add("booked");
        timeSlot.innerHTML = `
          <strong>${formattedTime}</strong><br>
          ${appointmentDetails?.customer_name}<br>
          ${appointmentDetails?.customer_phone}
        `;
      }
      if (appointmentGrid) {
        appointmentGrid.appendChild(timeSlot);
      }
    }

    modal.style.display = "flex"; 
  } else {
    console.error('No hairdresser found with the given ID.');
  }
}


