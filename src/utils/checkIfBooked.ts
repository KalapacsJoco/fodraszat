// Check if a time slot is booked
function checkIfBooked(
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