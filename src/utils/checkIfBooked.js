"use strict";
// Check if a time slot is booked
function checkIfBooked(appointments, hairdresserId, date, time) {
    return appointments.some((appointment) => {
        const [appointmentDate, appointmentTime] = appointment.appointment_date.split(" ");
        return (appointment.hairdresser_id === hairdresserId.toString() &&
            appointmentDate === date &&
            appointmentTime.substring(0, 5) === time);
    });
}
