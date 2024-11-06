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


