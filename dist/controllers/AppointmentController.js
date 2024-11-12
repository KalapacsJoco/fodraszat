var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { APPOINTMENTS_URL } from '../apiConfig.js';
// import { displayAvailableAppointments } from '../view/AppointmentView.js';
const appointmentSubmitButton = document.getElementById("appointment-submit");
const appointmentNameInput = document.getElementById("appointment-name");
const appointmentPhoneInput = document.getElementById("appointment-phone");
let selectedService = null;
let selectedHairdresser = null;
let selectedDate = null;
let selectedTimeSlot = null;
export function getAppointments() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(APPOINTMENTS_URL);
            return yield response.json();
        }
        catch (error) {
            console.error("Hiba az időpontok lekérése során:", error);
            return [];
        }
    });
}
export function checkIfBooked(appointments, hairdresserId, date, time) {
    return appointments.some((appointment) => {
        const [appointmentDate, appointmentTime] = appointment.appointment_date.split(" ");
        return (appointment.hairdresser_id === hairdresserId.toString() &&
            appointmentDate === date &&
            appointmentTime.substring(0, 5) === time);
    });
}
export function handleServiceSelection(checkbox) {
    const checkboxes = document.querySelectorAll('input[name="service"]');
    checkboxes.forEach((cb) => {
        if (cb !== checkbox)
            cb.checked = false;
    });
    selectedService = checkbox.checked ? checkbox.value : null;
}
// export async function bookAppointment(appointment: Appointment) {
//     try {
//       const response = await fetch(APPOINTMENTS_URL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(appointment),
//       });
//       if (response.ok) {
//         console.log("Időpontfoglalás sikeres!");
//         alert("Időpontfoglalás sikeres!");
//         location.reload();
//         if (selectedHairdresser && selectedDate) {
//           displayAvailableAppointments(selectedHairdresser, selectedDate);
//         }
//       } else {
//         console.error("Hiba történt az időpontfoglalás során!");
//         alert("Hiba történt az időpontfoglalás során!");
//       }
//     } catch (error) {
//       console.error("Hiba történt az időpontfoglalás során:", error);
//       alert("Hiba történt az időpontfoglalás során!");
//     }
//   }
