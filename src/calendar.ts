import {  loadHairdresserOptions } from './controllers/HairdresserController.js';
import { APPOINTMENTS_URL, HAIRDRESSERS_URL } from './components/apiConfig.js';
import { calendarContainer, closeModalButton, hairdresserSelect, modal, today } from './components/domElements.js';
import { showModal } from './controllers/ModalController.js';
import { getHairdresserStatistics } from './view/StatisticsView.js';
import { renderHairdresserStatistics } from './view/RenderHairdresserStatistics.js';

type Appointment = {
    hairdresser_id: string;
    appointment_date: string;
}
type Hairdresser = {
    id: number;
    name: string;
  }

// Fetch all appointments and filter by the selected hairdresser ID
async function loadAppointmentsForHairdresser(hairdresserId: number) {
    try {
        const response = await fetch(APPOINTMENTS_URL);
        const appointments: Appointment[] = await response.json();

        // Filter appointments for the selected hairdresser
        const filteredAppointments = appointments.filter(
            appointment => parseInt(appointment.hairdresser_id) === hairdresserId
        );

        updateCalendar(filteredAppointments);
    } catch (error) {
        console.error("Error loading appointments:", error);
    }
}

// Generate the calendar and color days based on bookings
function updateCalendar(appointments: Appointment[]) {
    calendarContainer.innerHTML = ""; // Clear the previous calendar

    // Create the header row for the days of the week
    const daysOfWeek: string[] = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];
    const headerRow = document.createElement("div");
    headerRow.classList.add("calendar-header");

    // Add each day of the week to the header row
    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement("div");
        dayHeader.classList.add("calendar-day-header");
        dayHeader.textContent = day;
        headerRow.appendChild(dayHeader);
    });

    calendarContainer.appendChild(headerRow);

    // Calendar setup for days
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const startDay = (new Date(today.getFullYear(), today.getMonth(), 1).getDay() + 6) % 7; // Adjust to start with Monday
    const totalCells = Math.ceil((daysInMonth + startDay) / 7) * 7; // Ensure full weeks

    for (let i = 0; i < totalCells; i++) {
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("calendar-day");

        const dayNumber = i >= startDay && i < startDay + daysInMonth ? i - startDay + 1 : null;

        if (dayNumber) {
            // Create the `mittom` element, which contains the day number
            const mittom = document.createElement("div");
            mittom.textContent = dayNumber.toString();
            mittom.classList.add("day-number"); // Optional styling class
            dayDiv.appendChild(mittom); // Add the day number div to the dayDiv

            // Format month and day with zero padding
            const month = today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1).toString();
            const day = dayNumber < 10 ? '0' + dayNumber : dayNumber.toString();
            const dayDate = `${today.getFullYear()}-${month}-${day}`;

            // Filter appointments by the day
            const dayAppointments = appointments.filter(appointment => {
              const [appointmentDate] = appointment.appointment_date.split(' ');
              return appointmentDate === dayDate;
            });

            // Display the number of appointments without replacing the day number
            const appointmentsInfo = document.createElement("div");
            appointmentsInfo.classList.add("appointments-info"); // Additional class for styling

            // Apply color and show appointment count
            if (dayAppointments.length > 0) {
                if (dayAppointments.length >= 1 && dayAppointments.length <= 8) {
                    dayDiv.classList.add("work-day-soft");
                } else if (dayAppointments.length >= 9) {
                    dayDiv.classList.add("work-day-hard");
                } else {
                    dayDiv.classList.add("work-day");
                }
                appointmentsInfo.textContent = `Foglalások: ${dayAppointments.length}`;
            } else {
                dayDiv.classList.add("free-day");
                dayDiv.title = "Nincs foglalás";
            }

            // Append the appointment information div to the dayDiv
            dayDiv.appendChild(appointmentsInfo);

            // Show modal with appointment info on click
            dayDiv.addEventListener("click", async () => {
                const hairdresserId = parseInt(hairdresserSelect.value, 10); // Kiválasztott fodrász ID
                const dayNumber = parseInt(dayDiv.textContent || "0", 10); // Nap száma (vagy más érték a DOM-ból)
                
                // Modal megjelenítése a kiválasztott fodrásszal és nappal
                await showModal(dayNumber, hairdresserId, today.getFullYear(), month, day);
              });
              
              // Modal bezáró gomb kezelője
            //   const closeModalButton = document.getElementById("modal-close-button") as HTMLElement;
            //   closeModalButton.addEventListener("click", () => {
            //     closeModal();
            //   });
        }

        // Append dayDiv to the calendar container
        calendarContainer.appendChild(dayDiv);
    }
}

// Close modal when clicking on the "close" button
closeModalButton.addEventListener("click", () => {
    modal.style.display = "none"; // Hide the modal
});

if(!hairdresserSelect) {

} else {
// Event listener for hairdresser selection
hairdresserSelect.addEventListener("change", () => {
    const selectedHairdresserId = parseInt(hairdresserSelect.value, 10);
    if (!isNaN(selectedHairdresserId)) {
        loadAppointmentsForHairdresser(selectedHairdresserId);
        renderHairdresserStatistics(selectedHairdresserId);

    }
});
}







getHairdresserStatistics();

// Initialize hairdresser options and calendar
loadHairdresserOptions();
updateCalendar([]); // Initial empty calendar
