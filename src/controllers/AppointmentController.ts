import { Appointment } from '../models/Appointment';
import { APPOINTMENTS_URL } from '../components/apiConfig.js';


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
  
  // Modified bookAppointment function with an optional callback
  export async function bookAppointment(appointment: Appointment, onSuccess?: () => void) {
    try {
      const response = await fetch(APPOINTMENTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointment),
      });
  
      if (response.ok) {
        console.log("Időpontfoglalás sikeres!");
        alert("Időpontfoglalás sikeres!");
        location.reload();
        
        // Call the onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
      } else {
        console.error("Hiba történt az időpontfoglalás során!");
        alert("Hiba történt az időpontfoglalás során!");
      }
    } catch (error) {
      console.error("Hiba történt az időpontfoglalás során:", error);
      alert("Hiba történt az időpontfoglalás során!");
    }
  }
  
  