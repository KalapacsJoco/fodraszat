var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getHairdressers } from "./HairdresserController.js";
import { getAppointments, checkIfBooked } from "./AppointmentController.js";
import { formatTime } from "../components/FormatTime.js";
export function showModal(dayNumber, hairdresserId, year, month, day) {
    return __awaiter(this, void 0, void 0, function* () {
        const modal = document.getElementById("appointment-modal");
        const appointmentGrid = document.getElementById("modal-appointment-grid");
        const hairdressers = yield getHairdressers();
        const hairdresser = hairdressers.find(h => h.id === hairdresserId);
        if (hairdresser) {
            const workStart = parseInt(hairdresser.work_start_time.split(':')[0]) * 60;
            const workEnd = parseInt(hairdresser.work_end_time.split(':')[0]) * 60;
            const appointments = yield getAppointments();
            const filteredAppointments = appointments.filter(appointment => appointment.hairdresser_id === hairdresserId.toString() &&
                appointment.appointment_date.startsWith(`${year}-${month}-${day}`));
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
                    const appointmentDetails = filteredAppointments.find(appointment => appointment.appointment_date.includes(formattedTime));
                    timeSlot.classList.add("booked");
                    timeSlot.innerHTML = `
          <strong>${formattedTime}</strong><br>
          ${appointmentDetails === null || appointmentDetails === void 0 ? void 0 : appointmentDetails.customer_name}<br>
          ${appointmentDetails === null || appointmentDetails === void 0 ? void 0 : appointmentDetails.customer_phone}
        `;
                }
                if (appointmentGrid) {
                    appointmentGrid.appendChild(timeSlot);
                }
            }
            modal.style.display = "flex";
        }
        else {
            console.error('No hairdresser found with the given ID.');
        }
    });
}
