var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { appointmentDateInput, appointmentTimes, appointmentForm, appointmentServices, } from "../components/domElements.js";
import { getAppointments } from "./AppointmentController";
import { formatTime } from "../components/FormatTime";
let selectedTimeSlot = null;
let selectedService = null;
export function showAppointmentForm(hairdresser) {
    if (appointmentForm) {
        appointmentForm.style.display = "block";
        generateServiceCheckboxes(hairdresser);
    }
    appointmentDateInput.addEventListener("change", () => {
        displayAvailableAppointments(hairdresser, appointmentDateInput.value);
    });
}
function generateServiceCheckboxes(hairdresser) {
    if (appointmentServices) {
        appointmentServices.innerHTML = ""; // Clear previous services
        hairdresser.services.forEach((service) => {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = "service";
            checkbox.value = service;
            checkbox.addEventListener("change", () => handleServiceSelection(checkbox));
            const label = document.createElement("label");
            label.textContent = service;
            appointmentServices.appendChild(checkbox);
            appointmentServices.appendChild(label);
            appointmentServices.appendChild(document.createElement("br"));
        });
    }
}
function displayAvailableAppointments(hairdresser, date) {
    return __awaiter(this, void 0, void 0, function* () {
        if (appointmentTimes) {
            appointmentTimes.innerHTML = "";
            const startTime = parseInt(hairdresser.work_start_time.split(":")[0]) * 60;
            const endTime = parseInt(hairdresser.work_end_time.split(":")[0]) * 60;
            const appointments = yield getAppointments();
            for (let time = startTime; time < endTime; time += 30) {
                const formattedTime = formatTime(time);
                const isBooked = checkIfBooked(appointments, hairdresser.id, date, formattedTime);
                const timeSlot = document.createElement("div");
                timeSlot.textContent = formattedTime;
                timeSlot.classList.add("time-slot");
                if (isBooked) {
                    timeSlot.classList.add("booked");
                }
                else {
                    timeSlot.addEventListener("click", () => selectTimeSlot(timeSlot, formattedTime));
                }
                appointmentTimes.appendChild(timeSlot);
            }
        }
    });
}
function selectTimeSlot(timeSlot, time) {
    const selected = document.querySelector(".time-slot.selected");
    if (selected)
        selected.classList.remove("selected");
    timeSlot.classList.add("selected");
    selectedTimeSlot = time;
}
function handleServiceSelection(checkbox) {
    selectedService = checkbox.checked ? checkbox.value : null;
}
