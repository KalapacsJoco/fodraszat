// import { formatTime } from "../components/FormatTime.js";
// import { checkIfBooked, getAppointments } from "../controllers/AppointmentController.js";
// import { getHairdressers } from "../controllers/HairdresserController.js";

// const calendarContainer = document.getElementById("calendar-container.js") as HTMLElement;
// const today = new Date();
// const hairdresserSelect = document.getElementById("hairdresser-select.js") as HTMLSelectElement;
// const modalTitle = document.getElementById("modal-day-title.js") as HTMLElement;
// const modal = document.getElementById("appointment-modal.js") as HTMLElement;
// const closeModalButton = document.getElementById("close-modal.js") as HTMLElement;




// type Appointment = {
//     hairdresser_id: string;
//     appointment_date: string;
// }


// export function updateCalendar(appointments: Appointment[]) {
//     calendarContainer.innerHTML = ""; // Clear the previous calendar

//     // Create the header row for the days of the week
//     const daysOfWeek = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];
//     const headerRow = document.createElement("div");
//     headerRow.classList.add("calendar-header");

//     // Add each day of the week to the header row
//     daysOfWeek.forEach(day => {
//         const dayHeader = document.createElement("div");
//         dayHeader.classList.add("calendar-day-header");
//         dayHeader.textContent = day;
//         headerRow.appendChild(dayHeader);
//     });

//     calendarContainer.appendChild(headerRow);

//     // Calendar setup for days
//     const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
//     const startDay = (new Date(today.getFullYear(), today.getMonth(), 1).getDay() + 6) % 7; // Adjust to start with Monday
//     const totalCells = Math.ceil((daysInMonth + startDay) / 7) * 7; // Ensure full weeks

//     for (let i = 0; i < totalCells; i++) {
//         const dayDiv = document.createElement("div");
//         dayDiv.classList.add("calendar-day");

//         const dayNumber = i >= startDay && i < startDay + daysInMonth ? i - startDay + 1 : null;

//         if (dayNumber) {
//             dayDiv.textContent = dayNumber.toString();

//             // Format month and day with zero padding
//             const month = today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1).toString();
//             const day = dayNumber < 10 ? '0' + dayNumber : dayNumber.toString();
//             const dayDate = `${today.getFullYear()}-${month}-${day}`;

//             // Az összes időpont szűrése a nap alapján
//             const dayAppointments = appointments.filter(appointment => {
//               const [appointmentDate] = appointment.appointment_date.split(' ');
//               return appointmentDate === dayDate;
//             });

//             // Apply color based on whether appointments exist for the day
//             if (dayAppointments.length > 0) {
//                 if (dayAppointments.length >= 1 && dayAppointments.length <= 8) {
//                     dayDiv.classList.add("work-day-soft");
//                     dayDiv.innerHTML = `Foglalások: ${dayAppointments.length}`;
//                 } else if (dayAppointments.length >= 9 && dayAppointments.length <= 17) {
//                     dayDiv.classList.add("work-day-hard");
//                     dayDiv.innerHTML = `Foglalások: ${dayAppointments.length}`;
//                 } else {
//                     dayDiv.classList.add("work-day");
//                     dayDiv.innerHTML = `Foglalások: ${dayAppointments.length}`;
//                 }
//             } else {
//                 dayDiv.classList.add("free-day");
//                 dayDiv.title = "Nincs foglalás";
//             }

//             // Show modal with appointment info on click

//             dayDiv.addEventListener("click", async () => {
//                 const hairdresserId = parseInt(hairdresserSelect.value, 10); // Kiválasztott fodrász ID-ja
//                 modalTitle.textContent = `${dayNumber}. nap foglalásai`;

//                 // Fodrász adatainak lekérése
//                 const hairdressers = await getHairdressers();
//                 const hairdresser = hairdressers.find(h => h.id === hairdresserId);

//                 if (hairdresser) {
//                   // Munkaidő beállítása a fodrász adatai alapján
//                   const workStart = parseInt(hairdresser.work_start_time.split(':')[0]) * 60; // Percben
//                   const workEnd = parseInt(hairdresser.work_end_time.split(':')[0]) * 60; // Percben

//                   // Összes időpont lekérdezése, majd szűrés az adott fodrászra és napra
//                   const appointments = await getAppointments();
//                   const filteredAppointments = appointments.filter(appointment =>
//                     appointment.hairdresser_id === hairdresserId.toString() &&
//                     appointment.appointment_date.startsWith(`${today.getFullYear()}-${month}-${day}`)
//                   );

//                   const appointmentGrid = document.getElementById("modal-appointment-grid");
//                   if (appointmentGrid) {
//                     appointmentGrid.innerHTML = ""; // Korábbi időpontok törlése
//                   }

//                   for (let time = workStart; time < workEnd; time += 30) {
//                     const timeSlot = document.createElement("div");
//                     timeSlot.classList.add("time-slot");

//                     const formattedTime = formatTime(time);
//                     timeSlot.textContent = formattedTime;

//                     // Ellenőrzés, hogy a félórás időpont foglalt-e
//                     const isBooked = checkIfBooked(filteredAppointments, hairdresserId, `${today.getFullYear()}-${month}-${day}`, formattedTime);

//                     if (isBooked) {
//                       const appointmentDetails = filteredAppointments.find(appointment =>
//                         appointment.appointment_date.includes(formattedTime) // Keresés a teljes dátum stringben
//                       );
//                       timeSlot.classList.add("booked");
//                       // Felhasználó nevének és telefonszámának megjelenítése
//                       timeSlot.innerHTML = `
//                         <strong>${formattedTime}</strong><br>
//                         ${appointmentDetails?.customer_name}<br>
//                         ${appointmentDetails?.customer_phone}
//                       `;
//                     }
//                     if (appointmentGrid) {
//                       appointmentGrid.appendChild(timeSlot);
//                     }
//                   }

//                   modal.style.display = "flex"; // Megjelenítjük a modalt
//                 } else {
//                   console.error('Nem található fodrász az adott ID-val.');
//                 }
//             });

//         }

//         calendarContainer.appendChild(dayDiv);
//     }
// }   
