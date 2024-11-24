var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getHairdressers } from "./controllers/HairdresserController.js";
import { formatTime } from "./components/FormatTime.js";
import { bookAppointment, checkIfBooked, getAppointments, } from "./controllers/AppointmentController.js";
import { appointmentCloseButton, appointmentDateInput, appointmentForm, appointmentNameInput, appointmentPhoneInput, appointmentServices, appointmentSubmitButton, appointmentTimes, hairdresserList, } from "./components/domElements.js";
import { getSelectedTimeSlot, setSelectedTimeSlot, getSelectedHairdresser, setSelectedHairdresser, getSelectedDate, setSelectedDate, getSelectedService, setSelectedService, } from "./utils/state.js";
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
                if (hairdresserList) {
                    hairdresserList.innerHTML += hairdresserElement;
                }
            });
            const appointmentButtons = document.querySelectorAll(".hairdresser button");
            appointmentButtons.forEach((button) => {
                const buttonElement = button;
                buttonElement.addEventListener("click", () => {
                    const hairdresserId = buttonElement.dataset.hairdresserId;
                    if (hairdresserId) {
                        const selectedHairdresser = hairdressers.find((h) => h.id === parseInt(hairdresserId)) || null;
                        setSelectedHairdresser(selectedHairdresser);
                        if (selectedHairdresser) {
                            showAppointmentForm(selectedHairdresser);
                        }
                    }
                });
            });
        }
    });
}
function showAppointmentForm(hairdresser) {
    if (appointmentForm) {
        appointmentForm.style.display = "block";
        setSelectedHairdresser(hairdresser);
        if (appointmentServices) {
            hairdresser.services.forEach((service) => {
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.name = "service";
                checkbox.value = service;
                checkbox.addEventListener("change", () => handleServiceSelection(checkbox));
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
            setSelectedDate(appointmentDateInput.value);
            displayAvailableAppointments(hairdresser, appointmentDateInput.value);
        });
    }
}
function displayAvailableAppointments(hairdresser, date) {
    return __awaiter(this, void 0, void 0, function* () {
        if (appointmentTimes) {
            appointmentTimes.innerHTML = "";
            setSelectedDate(date);
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
                        setSelectedTimeSlot(formattedTime);
                    });
                }
                appointmentTimes.appendChild(timeSlot);
            }
        }
    });
}
appointmentCloseButton.addEventListener("click", () => {
    if (appointmentForm) {
        appointmentForm.style.display = "none";
        location.reload();
    }
});
appointmentSubmitButton === null || appointmentSubmitButton === void 0 ? void 0 : appointmentSubmitButton.addEventListener("click", () => {
    const selectedHairdresser = getSelectedHairdresser();
    const selectedDate = getSelectedDate();
    const selectedTimeSlot = getSelectedTimeSlot();
    const selectedService = getSelectedService();
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
        bookAppointment(appointment, () => {
            displayAvailableAppointments(selectedHairdresser, selectedDate);
        });
    }
    else {
        alert("Kérjük, válasszon egy időpontot, szolgáltatást, és adja meg a szükséges adatokat.");
    }
});
function handleServiceSelection(checkbox) {
    const checkboxes = document.querySelectorAll('input[name="service"]');
    checkboxes.forEach((cb) => {
        if (cb !== checkbox)
            cb.checked = false;
    });
    setSelectedService(checkbox.checked ? checkbox.value : null);
}
displayHairdressers();
