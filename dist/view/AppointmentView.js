var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { checkIfBooked, getAppointments } from '../controllers/AppointmentController.js';
import { formatTime } from '../components/FormatTime.js';
const appointmentTimes = document.getElementById("appointment-times");
let selectedDate = null;
let selectedTimeSlot = null;
export function displayAvailableAppointments(hairdresser, date) {
    return __awaiter(this, void 0, void 0, function* () {
        if (appointmentTimes) {
            appointmentTimes.innerHTML = "";
            selectedDate = date;
            const startTime = parseInt(hairdresser.work_start_time.split(":")[0]) * 60;
            const endTime = parseInt(hairdresser.work_end_time.split(":")[0]) * 60;
            const appointments = yield getAppointments();
            for (let time = startTime; time < endTime; time += 30) {
                const timeSlot = document.createElement("div");
                timeSlot.classList.add("time-slot");
                const formattedTime = formatTime(time);
                timeSlot.textContent = formattedTime;
                const isBooked = checkIfBooked(appointments, hairdresser.id, date, formattedTime);
                if (isBooked) {
                    timeSlot.classList.add("booked");
                }
                else {
                    timeSlot.addEventListener("click", () => {
                        const previouslySelected = document.querySelector(".time-slot.selected");
                        if (previouslySelected)
                            previouslySelected.classList.remove("selected");
                        timeSlot.classList.add("selected");
                        selectedTimeSlot = formattedTime;
                    });
                }
                appointmentTimes.appendChild(timeSlot);
            }
        }
    });
}
