var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { APPOINTMENTS_URL } from '../components/apiConfig.js';
import { calendarContainer, hairdresserSelect, today } from '../components/domElements.js';
import { showModal } from './ModalController.js';
/**
 * Betölti a foglalásokat a kiválasztott fodrászhoz és frissíti a naptárt.
 */
export function loadAppointmentsForHairdresser(hairdresserId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(APPOINTMENTS_URL);
            const appointments = yield response.json();
            const filteredAppointments = appointments.filter(appointment => parseInt(appointment.hairdresser_id) === hairdresserId);
            updateCalendar(filteredAppointments);
        }
        catch (error) {
            console.error('Error loading appointments:', error);
        }
    });
}
/**
 * Frissíti a naptárat a megadott foglalások alapján.
 */
export function updateCalendar(appointments) {
    calendarContainer.innerHTML = '';
    const daysOfWeek = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'];
    const headerRow = document.createElement('div');
    headerRow.classList.add('calendar-header');
    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.classList.add('calendar-day-header');
        dayHeader.textContent = day;
        headerRow.appendChild(dayHeader);
    });
    calendarContainer.appendChild(headerRow);
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const startDay = (new Date(today.getFullYear(), today.getMonth(), 1).getDay() + 6) % 7;
    const totalCells = Math.ceil((daysInMonth + startDay) / 7) * 7;
    for (let i = 0; i < totalCells; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day');
        const dayNumber = i >= startDay && i < startDay + daysInMonth ? i - startDay + 1 : null;
        if (dayNumber) {
            const dayNumberDiv = document.createElement('div');
            dayNumberDiv.textContent = dayNumber.toString();
            dayNumberDiv.classList.add('day-number');
            dayDiv.appendChild(dayNumberDiv);
            const month = today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1).toString();
            const day = dayNumber < 10 ? '0' + dayNumber : dayNumber.toString();
            const dayDate = `${today.getFullYear()}-${month}-${day}`;
            const dayAppointments = appointments.filter(appointment => {
                const [appointmentDate] = appointment.appointment_date.split(' ');
                return appointmentDate === dayDate;
            });
            const appointmentsInfo = document.createElement('div');
            appointmentsInfo.classList.add('appointments-info');
            if (dayAppointments.length > 0) {
                dayDiv.classList.add(dayAppointments.length >= 8 ? 'work-day-hard' : 'work-day-soft');
                appointmentsInfo.textContent = `Foglalások: ${dayAppointments.length}`;
            }
            else {
                dayDiv.classList.add('free-day');
                dayDiv.title = 'Nincs foglalás';
            }
            if (dayNumber === today.getDate() &&
                today.getMonth() + 1 === parseInt(month, 10) &&
                today.getFullYear() === today.getFullYear()) {
                dayDiv.classList.add('today');
            }
            dayDiv.appendChild(appointmentsInfo);
            dayDiv.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
                const hairdresserId = parseInt(hairdresserSelect.value, 10);
                yield showModal(dayNumber, hairdresserId, today.getFullYear(), month, day);
            }));
        }
        calendarContainer.appendChild(dayDiv);
    }
}
