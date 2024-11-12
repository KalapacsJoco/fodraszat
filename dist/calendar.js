var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getHairdressers } from './controllers/HairdresserController.js';
import { APPOINTMENTS_URL } from './apiConfig.js';
import { getAppointments, checkIfBooked } from './controllers/AppointmentController.js';
import { formatTime } from './components/FormatTime.js';
const calendarContainer = document.getElementById("calendar-container");
const hairdresserSelect = document.getElementById("hairdresser-select");
const today = new Date();
// Modal elements
const modal = document.getElementById("appointment-modal");
const modalTitle = document.getElementById("modal-day-title");
const modalInfo = document.getElementById("modal-appointment-info");
const closeModalButton = document.getElementById("close-modal");
// Populate the select menu with hairdressers
function loadHairdresserOptions() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const hairdressers = yield getHairdressers();
            hairdressers.forEach(hairdresser => {
                const option = document.createElement("option");
                option.value = hairdresser.id.toString();
                option.textContent = hairdresser.name;
                hairdresserSelect.appendChild(option);
            });
        }
        catch (error) {
            console.error("Error loading hairdressers:", error);
        }
    });
}
// Fetch all appointments and filter by the selected hairdresser ID
function loadAppointmentsForHairdresser(hairdresserId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(APPOINTMENTS_URL);
            const appointments = yield response.json();
            // Filter appointments for the selected hairdresser
            const filteredAppointments = appointments.filter(appointment => parseInt(appointment.hairdresser_id) === hairdresserId);
            updateCalendar(filteredAppointments);
        }
        catch (error) {
            console.error("Error loading appointments:", error);
        }
    });
}
// Generate the calendar and color days based on bookings
function updateCalendar(appointments) {
    calendarContainer.innerHTML = ""; // Clear the previous calendar
    // Create the header row for the days of the week
    const daysOfWeek = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];
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
            dayDiv.textContent = dayNumber.toString();
            // Format month and day with zero padding
            const month = today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1).toString();
            const day = dayNumber < 10 ? '0' + dayNumber : dayNumber.toString();
            const dayDate = `${today.getFullYear()}-${month}-${day}`;
            // Filter appointments for the current day
            const dayAppointments = appointments.filter(appointment => appointment.appointment_date.startsWith(dayDate));
            // Apply color based on whether appointments exist for the day
            if (dayAppointments.length > 0) {
                if (dayAppointments.length >= 1 && dayAppointments.length <= 8) {
                    dayDiv.classList.add("work-day-soft");
                    dayDiv.innerHTML = `Foglalások: ${dayAppointments.length}`;
                }
                else if (dayAppointments.length >= 9 && dayAppointments.length <= 17) {
                    dayDiv.classList.add("work-day-hard");
                    dayDiv.innerHTML = `Foglalások: ${dayAppointments.length}`;
                }
                else {
                    dayDiv.classList.add("work-day");
                    dayDiv.innerHTML = `Foglalások: ${dayAppointments.length}`;
                }
            }
            else {
                dayDiv.classList.add("free-day");
                dayDiv.title = "Nincs foglalás";
            }
            // Show modal with appointment info on click
            dayDiv.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                const hairdresserId = parseInt(hairdresserSelect.value, 10); // Kiválasztott fodrász ID-ja
                modalTitle.textContent = `${dayNumber}. nap foglalásai`;
                // Fodrász adatainak lekérése
                const hairdressers = yield getHairdressers();
                const hairdresser = hairdressers.find(h => h.id === hairdresserId);
                if (hairdresser) {
                    // Munkaidő beállítása a fodrász adatai alapján
                    const workStart = parseInt(hairdresser.work_start_time.split(':')[0]) * 60; // Percben
                    const workEnd = parseInt(hairdresser.work_end_time.split(':')[0]) * 60; // Percben
                    // Összes időpont lekérdezése, majd szűrés az adott fodrászra és napra
                    const appointments = yield getAppointments();
                    const filteredAppointments = appointments.filter(appointment => appointment.hairdresser_id === hairdresserId.toString() &&
                        appointment.appointment_date.startsWith(`${today.getFullYear()}-${month}-${day}`));
                    const appointmentGrid = document.getElementById("modal-appointment-grid");
                    if (appointmentGrid) {
                        appointmentGrid.innerHTML = ""; // Korábbi időpontok törlése
                    }
                    // Munkaidő: reggel 8:00-tól este 19:00-ig, félórás blokkokban
                    // const workStart = 8 * 60; // Percben reggel 8:00
                    // const workEnd = 19 * 60; // Percben este 19:00
                    for (let time = workStart; time < workEnd; time += 30) {
                        const timeSlot = document.createElement("div");
                        timeSlot.classList.add("time-slot");
                        const formattedTime = formatTime(time);
                        timeSlot.textContent = formattedTime;
                        // Ellenőrzés, hogy a félórás időpont foglalt-e
                        const isBooked = checkIfBooked(filteredAppointments, hairdresserId, `${today.getFullYear()}-${month}-${day}`, formattedTime);
                        if (isBooked) {
                            const appointmentDetails = filteredAppointments.find(appointment => appointment.appointment_date.includes(formattedTime) // Keresés a teljes dátum stringben
                            );
                            timeSlot.classList.add("booked");
                            // Felhasználó nevének és telefonszámának megjelenítése
                            timeSlot.innerHTML = `
                        <strong>${formattedTime}</strong><br>
                        ${appointmentDetails === null || appointmentDetails === void 0 ? void 0 : appointmentDetails.customer_name}<br>
                        ${appointmentDetails === null || appointmentDetails === void 0 ? void 0 : appointmentDetails.customer_phone}
                      `;
                        }
                        if (appointmentGrid) {
                            appointmentGrid.appendChild(timeSlot);
                        }
                    }
                    modal.style.display = "flex"; // Megjelenítjük a modalt
                }
                else {
                    console.error('Nem található fodrász az adott ID-val.');
                }
            }));
        }
        calendarContainer.appendChild(dayDiv);
    }
}
// Close modal when clicking on the "close" button
closeModalButton.addEventListener("click", () => {
    modal.style.display = "none"; // Hide the modal
});
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
