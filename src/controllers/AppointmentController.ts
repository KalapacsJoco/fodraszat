import { Appointment } from '../models/Appointment';
import { APPOINTMENTS_URL } from '../apiConfig.js';
import { Hairdresser } from '../models/Hairdresser';
// import { displayAvailableAppointments } from '../view/AppointmentView.js';

const appointmentSubmitButton = document.getElementById(
    "appointment-submit"
  ) as HTMLButtonElement;
  const appointmentNameInput = document.getElementById(
    "appointment-name"
  ) as HTMLInputElement;
  const appointmentPhoneInput = document.getElementById(
    "appointment-phone"
  ) as HTMLInputElement;

let selectedService: string | null = null;
let selectedHairdresser: Hairdresser | null = null;
let selectedDate: string | null = null;
let selectedTimeSlot: string | null = null;





export async function getAppointments(): Promise<Appointment[]> {
    try {
      const response = await fetch(APPOINTMENTS_URL);
      return await response.json();
    } catch (error) {
      console.error("Hiba az időpontok lekérése során:", error);
      return [];
    }
  }

  export function checkIfBooked(
    appointments: Appointment[],
    hairdresserId: number,
    date: string,
    time: string
  ): boolean {
    return appointments.some((appointment) => {
      const [appointmentDate, appointmentTime] =
        appointment.appointment_date.split(" ");
      return (
        appointment.hairdresser_id === hairdresserId.toString() &&
        appointmentDate === date &&
        appointmentTime.substring(0, 5) === time
      );
    });
  }

  export function handleServiceSelection(checkbox: HTMLInputElement) {
    const checkboxes = document.querySelectorAll(
      'input[name="service"]'
    ) as NodeListOf<HTMLInputElement>;
    checkboxes.forEach((cb) => {
      if (cb !== checkbox) cb.checked = false;
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
  