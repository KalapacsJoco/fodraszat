import { getHairdressers } from './controllers/HairdresserController.js';
import { APPOINTMENTS_URL } from './apiConfig.js';

interface Hairdresser {
    id: number;
    name: string;
}

interface Appointment {
    hairdresser_id: string;
    appointment_date: string;
}

const calendarContainer = document.getElementById("calendar-container") as HTMLElement;
const hairdresserSelect = document.getElementById("hairdresser-select") as HTMLSelectElement;
const today = new Date();

// Populate the select menu with hairdressers
async function loadHairdresserOptions() {
    try {
        const hairdressers = await getHairdressers();
        hairdressers.forEach(hairdresser => {
            const option = document.createElement("option");
            option.value = hairdresser.id.toString();
            option.textContent = hairdresser.name;
            hairdresserSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading hairdressers:", error);
    }
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

    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const startDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
    const totalCells = 35;

    for (let i = 0; i < totalCells; i++) {
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("calendar-day");

        const dayNumber = i >= startDay && i < startDay + daysInMonth ? i - startDay + 1 : "";

        if (dayNumber) {
            dayDiv.textContent = dayNumber.toString();

            // Format month and day with zero padding
            const month = today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1).toString();
            const day = dayNumber < 10 ? '0' + dayNumber : dayNumber.toString();
            const dayDate = `${today.getFullYear()}-${month}-${day}`;

            // Filter appointments for the current day
            const dayAppointments = appointments.filter(appointment =>
                appointment.appointment_date.startsWith(dayDate)
            );

            // Apply color based on whether appointments exist for the day
            if (dayAppointments.length > 0) {
                dayDiv.style.backgroundColor = "red";
                dayDiv.title = `Foglalások: ${dayAppointments.length}`;
            } else {
                dayDiv.style.backgroundColor = "green";
                dayDiv.title = "Nincs foglalás";
            }

            // Open window with appointment info on click
            dayDiv.addEventListener("click", () => {
                const newWindow = window.open("", "_blank", "width=300,height=200");
                if (newWindow) {
                    newWindow.document.write(`<h2>Selected Day: ${dayNumber}</h2><p>${dayAppointments.length > 0 ? `Foglalások: ${dayAppointments.length}` : "Nincs foglalás"}</p>`);
                }
            });
        }

        calendarContainer.appendChild(dayDiv);
    }
}

// Event listener for hairdresser selection
hairdresserSelect.addEventListener("change", () => {
    const selectedHairdresserId = parseInt(hairdresserSelect.value, 10);
    if (!isNaN(selectedHairdresserId)) {
        loadAppointmentsForHairdresser(selectedHairdresserId);
    }
});

// Initialize hairdresser options and calendar
loadHairdresserOptions();
updateCalendar([]); // Initial empty calendar
