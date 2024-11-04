import { ApiService } from './apiService.js';

const apiService = new ApiService();

const hairdresserList = document.getElementById('hairdresserList')!;
const appointmentForm = document.getElementById('appointmentForm') as HTMLDivElement;
const bookingForm = document.getElementById('bookingForm') as HTMLFormElement;
const appointmentTimes = document.getElementById('appointmentTimes') as HTMLDivElement;
let selectedHairdresserId: number | null = null;
let selectedHairdresserWorkHours: { start: string; end: string } | null = null;
let selectedDate: string | null = null;

// Fodrászok betöltése
async function loadHairdressers() {
  try {
    const hairdressers = await apiService.getHairdressers();
    console.log("Fodrászok betöltése:", hairdressers);
    hairdresserList.innerHTML = '';

    hairdressers.forEach((hairdresser: any) => {
      const div = document.createElement('div');
      div.className = 'hairdresser-box';

      const servicesList = hairdresser.services.map((service: string) => `<h4>${service}</h4>`).join('');

      div.innerHTML = `
        <h3>${hairdresser.name}</h3>
        <h4>${hairdresser.email}</h4>
        <h4>${hairdresser.phone_number}</h4>
        <h4>${hairdresser.work_start_time}</h4>
        <h4>${hairdresser.work_end_time}</h4>
        <div>${servicesList}</div>
        <button onclick="bookAppointment(${hairdresser.id}, '${hairdresser.work_start_time}', '${hairdresser.work_end_time}')" class="book-btn">Foglalás</button>
      `;
      
      hairdresserList.appendChild(div);
    });
  } catch (error) {
    console.error('Error loading hairdressers:', error);
  }
}

// Foglalás gomb eseménykezelő
(window as any).bookAppointment = async (hairdresserId: number, workStart: string, workEnd: string) => {
  console.log(workStart)
  selectedHairdresserId = hairdresserId;
  selectedHairdresserWorkHours = { start: workStart, end: workEnd };
  appointmentForm.style.display = 'block';

  // Törli az előző időpontokat
  // appointmentTimes.innerHTML = '';

  const dateInput = document.getElementById('date') as HTMLInputElement;
  dateInput.addEventListener('change', async () => {
    selectedDate = dateInput.value;
    console.log("Kiválasztott dátum:", selectedDate);
    if (selectedDate && selectedHairdresserId) {
      try {
        const appointments = await apiService.getAppointment();
        console.log("Lekért foglalások:", appointments);
        displayBookedTimes(appointments, selectedDate);
      } catch (error) {
        console.error('Error loading appointments:', error);
      }
    }
  });
};

// Félórás intervallumok létrehozása adott munkaidő alapján
function createTimeIntervals(start: string, end: string) {
  const intervals = [];
  let currentTime = new Date(`1970-01-01T${start}:00`);
  const endTime = new Date(`1970-01-01T${end}:00`);

  while (currentTime < endTime) {
    intervals.push(new Date(currentTime));
    currentTime.setMinutes(currentTime.getMinutes() + 30);
  }
  console.log("Létrehozott időintervallumok:", intervals);
  return intervals;
}

// Időpontok megjelenítése a kiválasztott napra és fodrászra
async function displayBookedTimes(appointments: any[], date: string) {
  if (!selectedHairdresserWorkHours || !selectedHairdresserId) return;

  const { start, end } = selectedHairdresserWorkHours;
  const timeSlots = createTimeIntervals(start, end);

  // Szűrjük a kiválasztott fodrász adott napi foglalt időpontjait
  const bookedTimes = appointments
    .filter(appt => 
      appt.hairdresser_id === String(selectedHairdresserId) &&
      appt.appointment_date.startsWith(date)
    )
    .map(appt => new Date(appt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  console.log("Foglalások a kiválasztott napra:", bookedTimes);

  // Minden intervallumhoz megjelenít egy "Foglalt" vagy "Szabad" státuszt
  appointmentTimes.innerHTML = '<h4>Elérhető időpontok:</h4>';
  const timesList = timeSlots.map(time => {
    const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isBooked = bookedTimes.includes(timeStr);
    return `<li>${timeStr} - ${isBooked ? 'Foglalt' : `<button onclick="selectTime('${timeStr}')">Szabad</button>`}</li>`;
  }).join('');
  appointmentTimes.innerHTML += `<ul>${timesList}</ul>`;
}

// Kiválasztott időpont kezelése
(window as any).selectTime = (time: string) => {
  if (!selectedDate || !selectedHairdresserId) return;

  // Összeállítja az időpontfoglalási adatokat
  const customerName = (document.getElementById('customerName') as HTMLInputElement).value;
  const customerPhone = (document.getElementById('customerPhone') as HTMLInputElement).value;
  const appointmentData = {
    hairdresser_id: selectedHairdresserId,
    customer_name: customerName,
    customer_phone: customerPhone,
    appointment_date: `${selectedDate} ${time}:00`,
    service: 'Hajvágás'
  };

  apiService.createAppointment(appointmentData)
    .then(() => {
      alert('Sikeres foglalás!');
      appointmentForm.style.display = 'none';
      loadHairdressers();
    })
    .catch(error => {
      console.error('Error creating appointment:', error);
      alert('Hiba történt a foglalás során.');
    });
};

// Oldal betöltésekor a fodrászok betöltése
loadHairdressers();
