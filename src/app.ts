import { Hairdresser } from "./models/Hairdresser";
import { Appointment } from "./models/Appointment";
import { getHairdressers } from "./controllers/HairdresserController.js";
import { formatTime } from "./components/FormatTime.js";
import {
  bookAppointment,
  checkIfBooked,
  getAppointments,
} from "./controllers/AppointmentController.js";
import {
  appointmentCloseButton,
  appointmentDateInput,
  appointmentForm,
  appointmentNameInput,
  appointmentPhoneInput,
  appointmentServices,
  appointmentSubmitButton,
  appointmentTimes,
  hairdresserList,
} from "./components/domElements.js";
// import { displayHairdressers } from './view/HairdressersView.js';

// console.log(APPOINTMENTS_URL)

// // Variables to store selected appointment details
let selectedTimeSlot: string | null = null;
let selectedHairdresser: Hairdresser | null = null;
let selectedDate: string | null = null;
let selectedService: string | null = null;

// Display list of hairdressers
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

    // Appointment button event handler
    const appointmentButtons = document.querySelectorAll(".hairdresser button");
    appointmentButtons.forEach((button) => {
      const buttonElement = button as HTMLElement;
      buttonElement.addEventListener("click", () => {
        const hairdresserId = buttonElement.dataset.hairdresserId;
        if (hairdresserId) {
          selectedHairdresser =
            hairdressers.find((h) => h.id === parseInt(hairdresserId)) || null;
          if (selectedHairdresser) {
            showAppointmentForm(selectedHairdresser);
          }
        }
      });
    });
  }
}

// Show appointment form
function showAppointmentForm(hairdresser: Hairdresser) {
  if (appointmentForm) {
    appointmentForm.style.display = "block";
    selectedHairdresser = hairdresser;

    // Generate service checkboxes
    if (appointmentServices) {
      // appointmentServices.innerHTML = '<h4>Szolgáltatások:</h4>';
      hairdresser.services.forEach((service) => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "service";
        checkbox.value = service;
        checkbox.addEventListener("change", () =>
          handleServiceSelection(checkbox)
        );

        const label = document.createElement("label");
        label.textContent = service;

        if (appointmentServices) {
          appointmentServices.appendChild(checkbox);
          appointmentServices.appendChild(label);
          appointmentServices.appendChild(document.createElement("br"));
        }
      });
    }
  }

  if (appointmentDateInput) {
    appointmentDateInput.addEventListener("change", () => {
      selectedDate = appointmentDateInput.value;
      displayAvailableAppointments(hairdresser, appointmentDateInput.value);
    });
  }
}

// Display available appointments
async function displayAvailableAppointments(
  hairdresser: Hairdresser,
  date: string
) {
  if (appointmentTimes) {
    appointmentTimes.innerHTML = "";
    selectedDate = date;

    const startTime = parseInt(hairdresser.work_start_time.split(":")[0]) * 60;
    const endTime = parseInt(hairdresser.work_end_time.split(":")[0]) * 60;
    const appointments = await getAppointments();

    for (let time = startTime; time < endTime; time += 30) {
      const timeSlot = document.createElement("div");
      timeSlot.classList.add("time-slot");
      const formattedTime = formatTime(time);
      timeSlot.textContent = formattedTime;

      const isBooked = checkIfBooked(
        appointments,
        hairdresser.id,
        date,
        formattedTime
      );

      if (isBooked) {
        timeSlot.classList.add("booked");
      } else {
        timeSlot.addEventListener("click", () => {
          const previouslySelected = document.querySelector(
            ".time-slot.selected"
          );
          if (previouslySelected)
            previouslySelected.classList.remove("selected");
          timeSlot.classList.add("selected");
          selectedTimeSlot = formattedTime;
        });
      }

      appointmentTimes.appendChild(timeSlot);
    }
  }
}

appointmentCloseButton.addEventListener("click", () => {
  if (appointmentForm) {
    appointmentForm.style.display = "none";
    location.reload();
  }
});

appointmentSubmitButton?.addEventListener("click", () => {
  if (
    selectedHairdresser &&
    selectedDate &&
    selectedTimeSlot &&
    selectedService &&
    appointmentNameInput?.value &&
    appointmentPhoneInput?.value
  ) {
    const appointment: Appointment = {
      hairdresser_id: selectedHairdresser.id.toString(),
      customer_name: appointmentNameInput.value,
      customer_phone: appointmentPhoneInput.value,
      appointment_date: `${selectedDate} ${selectedTimeSlot}`,
      service: selectedService,
    };

    // `displayAvailableAppointments` meghívása callback-ként
    bookAppointment(appointment, () => {
      displayAvailableAppointments(selectedHairdresser!, selectedDate!);
    });
  } else {
    alert(
      "Kérjük, válasszon egy időpontot, szolgáltatást, és adja meg a szükséges adatokat."
    );
  }
});

function handleServiceSelection(checkbox: HTMLInputElement) {
  const checkboxes = document.querySelectorAll(
    'input[name="service"]'
  ) as NodeListOf<HTMLInputElement>;
  checkboxes.forEach((cb) => {
    if (cb !== checkbox) cb.checked = false;
  });
  selectedService = checkbox.checked ? checkbox.value : null;
}

// Initialize
displayHairdressers();
