import { Hairdresser } from "./models/Hairdresser";
import { getHairdressers } from "./controllers/HairdresserController.js";
import { bookAppointment } from "./controllers/AppointmentController.js";
import {
  appointmentCloseButton,
  appointmentSubmitButton,
  hairdresserList,
  appointmentNameInput,
  appointmentPhoneInput,
  appointmentForm,
} from "./components/domElements.js";

import {
  getSelectedHairdresser,
  getSelectedDate,
  getSelectedService,
  getSelectedTimeSlot,
  setSelectedHairdresser,
} from "./utils/state.js";

import { displayAvailableAppointments } from "./view/AppointmentView.js";
import { showAppointmentForm } from "./view/AppointmentFormView.js";

/**
 * Fodrászok listájának megjelenítése.
 */
async function displayHairdressers() {
  if (hairdresserList) {
    const hairdressers = await getHairdressers();

    hairdressers.forEach((hairdresser) => {
      const servicesList = hairdresser.services
        .map((service) => `<li>${service}</li>`)
        .join("");

      const hairdresserElement = `
        <div class="hairdresser">
          <div>
            <h3>${hairdresser.name}</h3>
            <p>${hairdresser.email}</p>
            <p>${hairdresser.phone_number}</p>
            <p>Munkaidő: ${hairdresser.work_start_time} - ${hairdresser.work_end_time}</p>
            <ul>${servicesList}</ul> 
            <button data-hairdresser-id="${hairdresser.id}">Időpontfoglalás</button>
          </div>
          <img src="/assets/images/${hairdresser.id}.jpg" alt="Kép leírása">
        </div>
      `;
      if (hairdresserList) {
      hairdresserList.innerHTML += hairdresserElement;
      }
    });

    // Eseménykezelő a foglalás gombokra
    document.querySelectorAll(".hairdresser button").forEach((button) => {
      const buttonElement = button as HTMLElement;
      buttonElement.addEventListener("click", () => {
        const hairdresserId = buttonElement.dataset.hairdresserId;
        if (hairdresserId) {
          const selectedHairdresser =
            hairdressers.find((h) => h.id === parseInt(hairdresserId)) || null;
          if (selectedHairdresser) {
            setSelectedHairdresser(selectedHairdresser);
            showAppointmentForm(selectedHairdresser);
          }
        }
      });
    });
  }
}

appointmentCloseButton?.addEventListener("click", () => {
  if (appointmentForm) {
    appointmentForm.style.display = "none";
    location.reload();
  }
});

appointmentSubmitButton?.addEventListener("click", () => {
  const selectedHairdresser = getSelectedHairdresser();
  const selectedDate = getSelectedDate();
  const selectedTimeSlot = getSelectedTimeSlot();
  const selectedService = getSelectedService();

  if (
    selectedHairdresser &&
    selectedDate &&
    selectedTimeSlot &&
    selectedService &&
    appointmentNameInput?.value &&
    appointmentPhoneInput?.value
  ) {
    const appointment = {
      hairdresser_id: selectedHairdresser.id.toString(),
      customer_name: appointmentNameInput.value,
      customer_phone: appointmentPhoneInput.value,
      appointment_date: `${selectedDate} ${selectedTimeSlot}`,
      service: selectedService,
    };

    bookAppointment(appointment, () => {
      displayAvailableAppointments(selectedHairdresser, selectedDate);
    });
  } else {
    alert("Kérjük, válasszon egy időpontot, szolgáltatást, és adja meg a szükséges adatokat.");
  }
});

// Fodrászok megjelenítése az oldal betöltésekor
displayHairdressers();
