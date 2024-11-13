import { getHairdressers } from './controllers/HairdresserController.js';
import { APPOINTMENTS_URL } from './apiConfig.js';
import { getAppointments, checkIfBooked } from './controllers/AppointmentController.js';
import { formatTime } from './components/FormatTime.js';

type Appointment = {
    hairdresser_id: string;
    appointment_date: string;
}

const calendarContainer = document.getElementById("calendar-container") as HTMLElement;
const hairdresserSelect = document.getElementById("hairdresser-select") as HTMLSelectElement;
const today = new Date();

// Modal elements
const modal = document.getElementById("appointment-modal") as HTMLElement;
const modalTitle = document.getElementById("modal-day-title") as HTMLElement;
const modalInfo = document.getElementById("modal-appointment-info") as HTMLElement;
const closeModalButton = document.getElementById("close-modal") as HTMLElement;

// Populate the select menu with hairdressers
async function loadHairdresserOptions() {
    const option =document.createElement("option");
    // option.value = ""
    option.textContent = "Válassz fodrászt"
    hairdresserSelect.appendChild(option);


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
                } else if (dayAppointments.length >= 9 && dayAppointments.length <= 17) {
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
                const hairdresserId = parseInt(hairdresserSelect.value, 10); // Selected hairdresser ID
                modalTitle.textContent = `${dayNumber}. nap foglalásai`;

                // Retrieve hairdresser details
                const hairdressers = await getHairdressers();
                const hairdresser = hairdressers.find(h => h.id === hairdresserId);

                if (hairdresser) {
                  // Set working hours from hairdresser's data
                  const workStart = parseInt(hairdresser.work_start_time.split(':')[0]) * 60;
                  const workEnd = parseInt(hairdresser.work_end_time.split(':')[0]) * 60;

                  // Get all appointments, filtered by the selected hairdresser and day
                  const appointments = await getAppointments();
                  const filteredAppointments = appointments.filter(appointment =>
                    appointment.hairdresser_id === hairdresserId.toString() &&
                    appointment.appointment_date.startsWith(`${today.getFullYear()}-${month}-${day}`)
                  );

                  const appointmentGrid = document.getElementById("modal-appointment-grid");
                  if (appointmentGrid) {
                    appointmentGrid.innerHTML = ""; // Clear previous appointments
                  }

                  for (let time = workStart; time < workEnd; time += 30) {
                    const timeSlot = document.createElement("div");
                    timeSlot.classList.add("time-slot");

                    const formattedTime = formatTime(time);
                    timeSlot.textContent = formattedTime;

                    // Check if this half-hour slot is booked
                    const isBooked = checkIfBooked(filteredAppointments, hairdresserId, `${today.getFullYear()}-${month}-${day}`, formattedTime);

                    if (isBooked) {
                      const appointmentDetails = filteredAppointments.find(appointment =>
                        appointment.appointment_date.includes(formattedTime)
                      );
                      timeSlot.classList.add("booked");
                      // Display customer's name and phone number
                      timeSlot.innerHTML = `
                        <strong>${formattedTime}</strong><br>
                        ${appointmentDetails?.customer_name}<br>
                        ${appointmentDetails?.customer_phone}
                      `;
                    }
                    if (appointmentGrid) {
                      appointmentGrid.appendChild(timeSlot);
                    }
                  }

                  modal.style.display = "flex"; // Display the modal
                } else {
                  console.error('No hairdresser found with the given ID.');
                }
            });
        }

        // Append dayDiv to the calendar container
        calendarContainer.appendChild(dayDiv);
    }
}

// Close modal when clicking on the "close" button
closeModalButton.addEventListener("click", () => {
    modal.style.display = "none"; // Hide the modal
});
// // Close modal when clicking on the "close" button
// closeModalButton.addEventListener("click", () => {
//     modal.style.display = "none"; // Hide the modal
// });

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
