// API végpontok
const API_BASE_URL = 'http://salonsapi.prooktatas.hu/api';
const HAIRDRESSERS_URL = `${API_BASE_URL}/hairdressers`;
const APPOINTMENTS_URL = `${API_BASE_URL}/appointments`;

// Fodrász adatszerkezet
interface Hairdresser {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  work_start_time: string;
  work_end_time: string;
  services: string[]; 
}

// Időpont adatszerkezet
interface Appointment {
  hairdresser_id: number;
  customer_name: string;
  customer_phone: string;
  appointment_date: string;
  service: string;
}

// HTML elemek
const hairdresserList: HTMLElement | null = document.getElementById('hairdresser-list');
const appointmentForm: HTMLElement | null = document.getElementById('appointment-form');
const appointmentDateInput: HTMLInputElement | null = document.getElementById('appointment-date') as HTMLInputElement;
const appointmentTimes: HTMLElement | null = document.getElementById('appointment-times');
const appointmentNameInput: HTMLInputElement | null = document.getElementById('appointment-name') as HTMLInputElement;
const appointmentPhoneInput: HTMLInputElement | null = document.getElementById('appointment-phone') as HTMLInputElement;
const appointmentSubmitButton: HTMLElement | null = document.getElementById('appointment-submit');

// Fodrászok listájának lekérése
async function getHairdressers(): Promise<Hairdresser[]> {
  const response = await fetch(HAIRDRESSERS_URL);
  return await response.json();
}

// Fodrászok megjelenítése
async function displayHairdressers() {
  if (hairdresserList) {
    const hairdressers = await getHairdressers();
    hairdressers.forEach(hairdresser => {
      const servicesList = hairdresser.services.map(service => `<li>${service}</li>`).join('');
      const hairdresserElement = `
        <div class="hairdresser">
          <h3>${hairdresser.name}</h3>
          <p>${hairdresser.email}</p>
          <p>${hairdresser.phone_number}</p>
          <p>Munkaidő: ${hairdresser.work_start_time} - ${hairdresser.work_end_time}</p>
          <ul>${servicesList}</ul> 
          <button data-hairdresser-id="${hairdresser.id}">Időpontfoglalás</button>
        </div>
      `;
      hairdresserList.innerHTML += hairdresserElement;
    });

    // Időpontfoglalás gomb eseménykezelő
    const appointmentButtons = document.querySelectorAll('.hairdresser button');
    appointmentButtons.forEach(button => {
      const buttonElement = button as HTMLElement; // Típuskényszerítés
      buttonElement.addEventListener('click', () => {
        const hairdresserId = buttonElement.dataset.hairdresserId;
        if (hairdresserId) {
          const selectedHairdresser = hairdressers.find(h => h.id === parseInt(hairdresserId));
          if (selectedHairdresser) {
            showAppointmentForm(selectedHairdresser);
          }
        }
      });
    });
  }
}

// Időpontfoglalás űrlap megjelenítése
function showAppointmentForm(hairdresser: Hairdresser) {
  if (appointmentForm) {
    appointmentForm.style.display = 'block';
  }

  if (appointmentDateInput) {
    appointmentDateInput.addEventListener('change', () => {
      displayAvailableAppointments(hairdresser, appointmentDateInput.value);
    });
  }
}

// Elérhető időpontok megjelenítése
async function displayAvailableAppointments(hairdresser: Hairdresser, date: string) {
  if (appointmentTimes) {
    appointmentTimes.innerHTML = '';

    const appointments = await getAppointments(hairdresser.id, date);

    const startTime = parseInt(hairdresser.work_start_time.split(':')[0]) * 60;
    const endTime = parseInt(hairdresser.work_end_time.split(':')[0]) * 60;

    for (let time = startTime; time < endTime; time += 30) {
      const timeSlot = document.createElement('div');
      timeSlot.classList.add('time-slot');
      const formattedTime = formatTime(time);
      timeSlot.textContent = formattedTime;

      const isBooked = appointments.some(appointment => {
        const appointmentTime = new Date(appointment.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return appointmentTime === formattedTime;
      });

      if (isBooked) {
        timeSlot.classList.add('booked');
      } else {
        timeSlot.addEventListener('click', () => {
          if (appointmentNameInput && appointmentPhoneInput) {
            const appointment: Appointment = {
              hairdresser_id: hairdresser.id,
              customer_name: appointmentNameInput.value,
              customer_phone: appointmentPhoneInput.value,
              appointment_date: `${date} ${formattedTime}`,
              service: 'Hajvágás' 
            };
            bookAppointment(appointment);
          }
        });
      }

      appointmentTimes.appendChild(timeSlot);
    }
  }
}

// Időpontok lekérése
async function getAppointments(hairdresserId: number, date: string): Promise<Appointment[]> {
  const response = await fetch(APPOINTMENTS_URL);
  const appointments: Appointment[] = await response.json();
  return appointments.filter(appointment => 
    appointment.hairdresser_id === hairdresserId && 
    appointment.appointment_date.startsWith(date)
  );
}

// Idő formázása
function formatTime(timeInMinutes: number): string {
  const hours = Math.floor(timeInMinutes / 60);
  const minutes = timeInMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Időpontfoglalás
async function bookAppointment(appointment: Appointment) {
  try {
    const response = await fetch(APPOINTMENTS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(appointment)
    });

    if (response.ok) {
      console.log('Időpontfoglalás sikeres!');
      // TODO: Sikeres foglalás esetén visszajelzés a felhasználónak
    } else {
      console.error('Hiba történt az időpontfoglalás során!');
      // TODO: Hiba esetén hibaüzenet megjelenítése
    }
  } catch (error) {
    console.error('Hiba történt az időpontfoglalás során:', error);
    // TODO: Hiba esetén hibaüzenet megjelenítése
  }
}

// Inicializálás
displayHairdressers();