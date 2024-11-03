var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ApiService } from './apiService.js';
const apiService = new ApiService();
const hairdresserList = document.getElementById('hairdresserList');
const appointmentForm = document.getElementById('appointmentForm');
const bookingForm = document.getElementById('bookingForm');
let selectedHairdresserId = null;
function loadHairdressers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const hairdressers = yield apiService.getHairdressers();
            hairdresserList.innerHTML = '';
            hairdressers.forEach((hairdresser) => {
                const div = document.createElement('div');
                div.className = 'hairdresser-box';
                // Meghatározzuk a service típusát
                const servicesList = hairdresser.services.map((service) => `<h4>${service}</h4>`).join('');
                div.innerHTML = `
        <h3>${hairdresser.name}</h3>
        <h4>${hairdresser.email}</h4>
        <h4>${hairdresser.phone_number}</h4>
        <h4>${hairdresser.work_start_time}</h4>
        <h4>${hairdresser.work_end_time}</h4>
        <div>${servicesList}</div>
        <button onclick="bookAppointment(${hairdresser.id})" class="book-btn">Foglalás</button>
      `;
                hairdresserList.appendChild(div);
            });
        }
        catch (error) {
            console.error('Error loading hairdressers:', error);
        }
    });
}
window.bookAppointment = (hairdresserId) => {
    selectedHairdresserId = hairdresserId;
    appointmentForm.style.display = 'block';
};
bookingForm.onsubmit = (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    if (!selectedHairdresserId)
        return;
    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const date = document.getElementById('date').value;
    const appointmentData = {
        hairdresser_id: selectedHairdresserId,
        customer_name: customerName,
        customer_phone: customerPhone,
        appointment_date: `${date} 14:00:00`,
        service: 'Hajvágás'
    };
    try {
        yield apiService.createAppointment(appointmentData);
        alert('Sikeres foglalás!');
        appointmentForm.style.display = 'none';
        loadHairdressers(); // Refresh list if needed
    }
    catch (error) {
        console.error('Error creating appointment:', error);
        alert('Hiba történt a foglalás során.');
    }
});
loadHairdressers();
