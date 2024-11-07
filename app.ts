import { Hairdresser } from './interfaces/Hairdresser';
import { Appointment } from './interfaces/Appointment';
// import { displayHairdressers, } from './interfaces/Appointment';
// import { API_BASE_URL, HAIRDRESSERS_URL, APPOINTMENTS_URL } from './apiEndPoint';

const API_BASE_URL = "http://salonsapi.prooktatas.hu/api";
const HAIRDRESSERS_URL = `${API_BASE_URL}/hairdressers`;
const APPOINTMENTS_URL = `${API_BASE_URL}/appointments`;

// HTML elements
const hairdresserList = document.getElementById("hairdresser-list");
const appointmentForm = document.getElementById("appointment-form");
const appointmentDateInput = document.getElementById(
  "appointment-date"
) as HTMLInputElement;
const appointmentTimes = document.getElementById("appointment-times");
const appointmentServices = document.getElementById("appointment-services");
const appointmentNameInput = document.getElementById(
  "appointment-name"
) as HTMLInputElement;
const appointmentPhoneInput = document.getElementById(
  "appointment-phone"
) as HTMLInputElement;
const appointmentSubmitButton = document.getElementById(
  "appointment-submit"
) as HTMLButtonElement;
const appointmentCloseButton = document.getElementById(
  "appointment-form-close-button"
) as HTMLButtonElement;

// Variables to store selected appointment details
let selectedTimeSlot: string | null = null;
let selectedHairdresser: Hairdresser | null = null;
let selectedDate: string | null = null;
let selectedService: string | null = null;


// Fetch list of hairdressers
async function getHairdressers(): Promise<Hairdresser[]> {
  const response = await fetch(HAIRDRESSERS_URL);
  return await response.json();
}

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
                    <h3>${hairdresser.name}</h3>
                    <img src="/assets/images/${hairdresser.id}.jpg" alt="Kép leírása">
                    <p>${hairdresser.email}</p>
                    <p>${hairdresser.phone_number}</p>
                    <p>Munkaidő: ${hairdresser.work_start_time} - ${hairdresser.work_end_time}</p>
                    <ul>${servicesList}</ul> 
                    <button data-hairdresser-id="${hairdresser.id}">Időpontfoglalás</button>
                </div>
            `;
      hairdresserList.innerHTML += hairdresserElement;
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

        appointmentServices.appendChild(checkbox);
        appointmentServices.appendChild(label);
        appointmentServices.appendChild(document.createElement("br"));
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

// Handle service selection (only allow one checkbox to be selected at a time)
function handleServiceSelection(checkbox: HTMLInputElement) {
  const checkboxes = document.querySelectorAll(
    'input[name="service"]'
  ) as NodeListOf<HTMLInputElement>;
  checkboxes.forEach((cb) => {
    if (cb !== checkbox) cb.checked = false;
  });
  selectedService = checkbox.checked ? checkbox.value : null;
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

// Check if a time slot is booked
function checkIfBooked(
  appointments: Appointment[],
  hairdresserId: number,
  date: string,
  time: string
): boolean {
  return appointments.some((appointment) => {
    const [appointmentDate, appointmentTime] =
      appointment.appointment_date.split(" ");
    return (
      appointment.hairdresser_id === hairdresserId.toString() &&
      appointmentDate === date &&
      appointmentTime.substring(0, 5) === time
    );
  });
}

// Fetch all appointments
async function getAppointments(): Promise<Appointment[]> {
  try {
    const response = await fetch(APPOINTMENTS_URL);
    return await response.json();
  } catch (error) {
    console.error("Hiba az időpontok lekérése során:", error);
    return [];
  }
}

// Format time from minutes
function formatTime(timeInMinutes: number): string {
  const hours = Math.floor(timeInMinutes / 60);
  const minutes = timeInMinutes % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

// Book appointment
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
    bookAppointment(appointment);
  } else {
    alert(
      "Kérjük, válasszon egy időpontot, szolgáltatást, és adja meg a szükséges adatokat."
    );
  }
});

appointmentCloseButton.addEventListener("click", () => {
  if (appointmentForm) {
    appointmentForm.style.display = "none";
    location.reload();
  }
});

// Book appointment function
async function bookAppointment(appointment: Appointment) {
  try {
    const response = await fetch(APPOINTMENTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointment),
    });

    if (response.ok) {
      console.log("Időpontfoglalás sikeres!");
      alert("Időpontfoglalás sikeres!");
      location.reload();
      if (selectedHairdresser && selectedDate) {
        displayAvailableAppointments(selectedHairdresser, selectedDate);
      }
    } else {
      console.error("Hiba történt az időpontfoglalás során!");
      alert("Hiba történt az időpontfoglalás során!");
    }
  } catch (error) {
    console.error("Hiba történt az időpontfoglalás során:", error);
    alert("Hiba történt az időpontfoglalás során!");
  }
}

// Initialize
displayHairdressers();
