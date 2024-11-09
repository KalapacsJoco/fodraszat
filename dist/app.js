var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { APPOINTMENTS_URL } from './apiConfig.js';
import { getHairdressers } from './controllers/HairdresserController.js';
import { checkIfBooked, getAppointments } from './controllers/AppointmentController.js';
import { formatTime } from './components/FormatTime.js';
// console.log(APPOINTMENTS_URL)
// HTML elements
const hairdresserList = document.getElementById("hairdresser-list");
const appointmentForm = document.getElementById("appointment-form");
const appointmentDateInput = document.getElementById("appointment-date");
const appointmentTimes = document.getElementById("appointment-times");
const appointmentServices = document.getElementById("appointment-services");
const appointmentNameInput = document.getElementById("appointment-name");
const appointmentPhoneInput = document.getElementById("appointment-phone");
const appointmentSubmitButton = document.getElementById("appointment-submit");
const appointmentCloseButton = document.getElementById("appointment-form-close-button");
// // Variables to store selected appointment details
let selectedTimeSlot = null;
let selectedHairdresser = null;
let selectedDate = null;
let selectedService = null;
// Display list of hairdressers
function displayHairdressers() {
    return __awaiter(this, void 0, void 0, function* () {
        if (hairdresserList) {
            const hairdressers = yield getHairdressers();
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
                hairdresserList.innerHTML += hairdresserElement;
            });
            // Appointment button event handler
            const appointmentButtons = document.querySelectorAll(".hairdresser button");
            appointmentButtons.forEach((button) => {
                const buttonElement = button;
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
    });
}
// Show appointment form
function showAppointmentForm(hairdresser) {
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
                checkbox.addEventListener("change", () => handleServiceSelection(checkbox));
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
function handleServiceSelection(checkbox) {
    const checkboxes = document.querySelectorAll('input[name="service"]');
    checkboxes.forEach((cb) => {
        if (cb !== checkbox)
            cb.checked = false;
    });
    selectedService = checkbox.checked ? checkbox.value : null;
}
// Display available appointments
function displayAvailableAppointments(hairdresser, date) {
    return __awaiter(this, void 0, void 0, function* () {
        if (appointmentTimes) {
            appointmentTimes.innerHTML = "";
            selectedDate = date;
            const startTime = parseInt(hairdresser.work_start_time.split(":")[0]) * 60;
            const endTime = parseInt(hairdresser.work_end_time.split(":")[0]) * 60;
            const appointments = yield getAppointments();
            for (let time = startTime; time < endTime; time += 30) {
                const timeSlot = document.createElement("div");
                timeSlot.classList.add("time-slot");
                const formattedTime = formatTime(time);
                timeSlot.textContent = formattedTime;
                const isBooked = checkIfBooked(appointments, hairdresser.id, date, formattedTime);
                if (isBooked) {
                    timeSlot.classList.add("booked");
                }
                else {
                    timeSlot.addEventListener("click", () => {
                        const previouslySelected = document.querySelector(".time-slot.selected");
                        if (previouslySelected)
                            previouslySelected.classList.remove("selected");
                        timeSlot.classList.add("selected");
                        selectedTimeSlot = formattedTime;
                    });
                }
                appointmentTimes.appendChild(timeSlot);
            }
        }
    });
}
// Book appointment
appointmentSubmitButton === null || appointmentSubmitButton === void 0 ? void 0 : appointmentSubmitButton.addEventListener("click", () => {
    if (selectedHairdresser &&
        selectedDate &&
        selectedTimeSlot &&
        selectedService &&
        (appointmentNameInput === null || appointmentNameInput === void 0 ? void 0 : appointmentNameInput.value) &&
        (appointmentPhoneInput === null || appointmentPhoneInput === void 0 ? void 0 : appointmentPhoneInput.value)) {
        const appointment = {
            hairdresser_id: selectedHairdresser.id.toString(),
            customer_name: appointmentNameInput.value,
            customer_phone: appointmentPhoneInput.value,
            appointment_date: `${selectedDate} ${selectedTimeSlot}`,
            service: selectedService,
        };
        bookAppointment(appointment);
    }
    else {
        alert("Kérjük, válasszon egy időpontot, szolgáltatást, és adja meg a szükséges adatokat.");
    }
});
appointmentCloseButton.addEventListener("click", () => {
    if (appointmentForm) {
        appointmentForm.style.display = "none";
        location.reload();
    }
});
// Book appointment function
function bookAppointment(appointment) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(APPOINTMENTS_URL, {
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
            }
            else {
                console.error("Hiba történt az időpontfoglalás során!");
                alert("Hiba történt az időpontfoglalás során!");
            }
        }
        catch (error) {
            console.error("Hiba történt az időpontfoglalás során:", error);
            alert("Hiba történt az időpontfoglalás során!");
        }
    });
}
// Initialize
displayHairdressers();
