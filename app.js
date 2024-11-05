"use strict";
// API endpoints
const API_BASE_URL = 'http://salonsapi.prooktatas.hu/api';
const HAIRDRESSERS_URL = `${API_BASE_URL}/hairdressers`;
const APPOINTMENTS_URL = `${API_BASE_URL}/appointments`;
// HTML elements
const hairdresserList = document.getElementById('hairdresser-list');
const appointmentForm = document.getElementById('appointment-form');
const appointmentDateInput = document.getElementById('appointment-date');
const appointmentTimes = document.getElementById('appointment-times');
const appointmentNameInput = document.getElementById('appointment-name');
const appointmentPhoneInput = document.getElementById('appointment-phone');
// Fetch list of hairdressers
async function getHairdressers() {
    const response = await fetch(HAIRDRESSERS_URL);
    return await response.json();
}
// Display list of hairdressers
async function displayHairdressers() {
    if (hairdresserList) {
        const hairdressers = await getHairdressers();
        hairdressers.forEach(hairdresser => {
            const servicesList = hairdresser.services.map(service => `<li>${service}</li>`).join('');
            const hairdresserElement = `
        <div class="hairdresser">
          <h3>${hairdresser.name}</h3>
          <p>${hairdresser.email}</p>
          <p>${hairdresser.phone_number}</p>
          <p>Munkaidő: ${hairdresser.work_start_time} - ${hairdresser.work_end_time}</p>
          <ul>${servicesList}</ul> 
          <button data-hairdresser-id="${hairdresser.id}">Időpontfoglalás</button>
        </div>
      `;
            hairdresserList.innerHTML += hairdresserElement;
        });
        // Appointment button event handler
        const appointmentButtons = document.querySelectorAll('.hairdresser button');
        appointmentButtons.forEach(button => {
            const buttonElement = button;
            buttonElement.addEventListener('click', () => {
                const hairdresserId = buttonElement.dataset.hairdresserId;
                if (hairdresserId) {
                    const selectedHairdresser = hairdressers.find(h => h.id === parseInt(hairdresserId));
                    if (selectedHairdresser) {
                        showAppointmentForm(selectedHairdresser);
                    }
                }
            });
        });
    }
}
// Show appointment form
function showAppointmentForm(hairdresser) {
    if (appointmentForm) {
        appointmentForm.style.display = 'block';
    }
    if (appointmentDateInput) {
        appointmentDateInput.addEventListener('change', () => {
            displayAvailableAppointments(hairdresser, appointmentDateInput.value);
        });
    }
}
// Display available appointments
async function displayAvailableAppointments(hairdresser, date) {
    if (appointmentTimes) {
        appointmentTimes.innerHTML = '';
        const startTime = parseInt(hairdresser.work_start_time.split(':')[0]) * 60;
        const endTime = parseInt(hairdresser.work_end_time.split(':')[0]) * 60;
        const appointments = await getAppointments();
        for (let time = startTime; time < endTime; time += 30) {
            const timeSlot = document.createElement('div');
            timeSlot.classList.add('time-slot');
            const formattedTime = formatTime(time);
            timeSlot.textContent = formattedTime;
            const isBooked = checkIfBooked(appointments, hairdresser.id, date, formattedTime);
            if (isBooked) {
                timeSlot.classList.add('booked');
                timeSlot.textContent += ' (Foglalt)';
            }
            else {
                // Attach booking event for free time slots
                timeSlot.addEventListener('click', () => {
                    if (appointmentNameInput && appointmentPhoneInput) {
                        const appointment = {
                            hairdresser_id: hairdresser.id.toString(),
                            customer_name: appointmentNameInput.value,
                            customer_phone: appointmentPhoneInput.value,
                            appointment_date: `${date} ${formattedTime}`,
                            service: 'Hajvágás'
                        };
                        bookAppointment(appointment);
                    }
                });
            }
            appointmentTimes.appendChild(timeSlot);
        }
    }
}
// Check if a time slot is booked
function checkIfBooked(appointments, hairdresserId, date, time) {
    return appointments.some(appointment => {
        const [appointmentDate, appointmentTime] = appointment.appointment_date.split(' ');
        return (appointment.hairdresser_id === hairdresserId.toString() &&
            appointmentDate === date &&
            appointmentTime.substring(0, 5) === time);
    });
}
// Fetch all appointments
async function getAppointments() {
    try {
        const response = await fetch(APPOINTMENTS_URL);
        return await response.json();
    }
    catch (error) {
        console.error('Hiba az időpontok lekérése során:', error);
        return [];
    }
}
// Format time from minutes
function formatTime(timeInMinutes) {
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
// Book appointment
async function bookAppointment(appointment) {
    try {
        const response = await fetch(APPOINTMENTS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appointment)
        });
        if (response.ok) {
            console.log('Időpontfoglalás sikeres!');
            alert('Időpontfoglalás sikeres!');
            // Refresh the appointments view to show the new booking as "booked"
            if (appointmentDateInput && appointmentDateInput.value) {
                const hairdresserId = parseInt(appointment.hairdresser_id);
                const hairdresser = { id: hairdresserId };
                displayAvailableAppointments(hairdresser, appointmentDateInput.value);
            }
        }
        else {
            console.error('Hiba történt az időpontfoglalás során!');
            alert('Hiba történt az időpontfoglalás során!');
        }
    }
    catch (error) {
        console.error('Hiba történt az időpontfoglalás során:', error);
        alert('Hiba történt az időpontfoglalás során!');
    }
}
// Initialize
displayHairdressers();
