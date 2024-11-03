
import { ApiService } from './apiService.js';

const apiService = new ApiService();

const hairdresserList = document.getElementById('hairdresserList')!;
const appointmentForm = document.getElementById('appointmentForm') as HTMLDivElement;
const bookingForm = document.getElementById('bookingForm') as HTMLFormElement;
let selectedHairdresserId: number | null = null;

async function loadHairdressers() {
  try {
    const hairdressers = await apiService.getHairdressers();
    hairdresserList.innerHTML = '';

    hairdressers.forEach((hairdresser: any) => {
      const div = document.createElement('div');
      div.className = 'hairdresser-box';
      
      // Meghatározzuk a service típusát
      const servicesList = hairdresser.services.map((service: string) => `<h4>${service}</h4>`).join('');

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
  } catch (error) {
    console.error('Error loading hairdressers:', error);
  }
}



(window as any).bookAppointment = (hairdresserId: number) => {
  selectedHairdresserId = hairdresserId;
  appointmentForm.style.display = 'block';
};

bookingForm.onsubmit = async (event) => {
  event.preventDefault();
  if (!selectedHairdresserId) return;

  const customerName = (document.getElementById('customerName') as HTMLInputElement).value;
  const customerPhone = (document.getElementById('customerPhone') as HTMLInputElement).value;
  const date = (document.getElementById('date') as HTMLInputElement).value;

  const appointmentData = {
    hairdresser_id: selectedHairdresserId,
    customer_name: customerName,
    customer_phone: customerPhone,
    appointment_date: `${date} 14:00:00`,
    service: 'Hajvágás'
  };

  try {
    await apiService.createAppointment(appointmentData);
    alert('Sikeres foglalás!');
    appointmentForm.style.display = 'none';
    loadHairdressers(); // Refresh list if needed
  } catch (error) {
    console.error('Error creating appointment:', error);
    alert('Hiba történt a foglalás során.');
  }
};

loadHairdressers();
