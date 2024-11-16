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


async function loadAppointmentsForHairdresser(hairdresserId: number) {
    try {
        const response = await fetch(APPOINTMENTS_URL);
        const appointments: Appointment[] = await response.json();

        const filteredAppointments = appointments.filter(
            appointment => parseInt(appointment.hairdresser_id) === hairdresserId
        );

        updateCalendar(filteredAppointments);
    } catch (error) {
        console.error("Error loading appointments:", error);
    }
}

function updateCalendar(appointments: Appointment[]) {
    calendarContainer.innerHTML = ""; 

    const daysOfWeek: string[] = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];
    const headerRow = document.createElement("div");
    headerRow.classList.add("calendar-header");

    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement("div");
        dayHeader.classList.add("calendar-day-header");
        dayHeader.textContent = day;
        headerRow.appendChild(dayHeader);
    });

    calendarContainer.appendChild(headerRow);

    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const startDay = (new Date(today.getFullYear(), today.getMonth(), 1).getDay() + 6) % 7; 
    const totalCells = Math.ceil((daysInMonth + startDay) / 7) * 7; 

    for (let i = 0; i < totalCells; i++) {
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("calendar-day");
    
        const dayNumber = i >= startDay && i < startDay + daysInMonth ? i - startDay + 1 : null;
    
        if (dayNumber) {
            const mittom = document.createElement("div");
            mittom.textContent = dayNumber.toString();
            mittom.classList.add("day-number"); 
            dayDiv.appendChild(mittom); 
    
            const month = today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1).toString();
            const day = dayNumber < 10 ? '0' + dayNumber : dayNumber.toString();
            const dayDate = `${today.getFullYear()}-${month}-${day}`;
    
            const dayAppointments = appointments.filter(appointment => {
                const [appointmentDate] = appointment.appointment_date.split(' ');
                return appointmentDate === dayDate;
            });
    
            const appointmentsInfo = document.createElement("div");
            appointmentsInfo.classList.add("appointments-info");
    
            if (dayAppointments.length > 0) {
                if (dayAppointments.length >= 1 && dayAppointments.length < 8) {
                    dayDiv.classList.add("work-day-soft");
                } else if (dayAppointments.length >= 8) {
                    dayDiv.classList.add("work-day-hard");
                } else {
                    dayDiv.classList.add("work-day");
                }
                appointmentsInfo.textContent = `Foglalások: ${dayAppointments.length}`;
            } else {
                dayDiv.classList.add("free-day");
                dayDiv.title = "Nincs foglalás";
            }
    
            // Hozzáadjuk a "today" osztályt, ha a nap megegyezik a mai nappal
            if (
                dayNumber === today.getDate() &&
                today.getMonth() + 1 === parseInt(month, 10) &&
                today.getFullYear() === today.getFullYear()
            ) {
                dayDiv.classList.add("today");
            }
    
            dayDiv.appendChild(appointmentsInfo);
    
            dayDiv.addEventListener("click", async () => {
                const hairdresserId = parseInt(hairdresserSelect.value, 10); // Kiválasztott fodrász ID
                const dayNumber = parseInt(dayDiv.textContent || "0", 10); // Nap száma (vagy más érték a DOM-ból)
                
                await showModal(dayNumber, hairdresserId, today.getFullYear(), month, day);
            });           
        }
    
        calendarContainer.appendChild(dayDiv);
    }
    
}

closeModalButton.addEventListener("click", () => {
    modal.style.display = "none"; 
});

if(!hairdresserSelect) {

} else {
hairdresserSelect.addEventListener("change", () => {
    const selectedHairdresserId = parseInt(hairdresserSelect.value, 10);
    if (!isNaN(selectedHairdresserId)) {
        loadAppointmentsForHairdresser(selectedHairdresserId);
        renderHairdresserStatistics(selectedHairdresserId);

    }
});
}

getHairdresserStatistics();
loadHairdresserOptions();
updateCalendar([]); 
