var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { appointmentDateInput, appointmentForm, appointmentServices } from "../components/variables";
import { getHairdressers } from "../controllers/HairdresserController";
const hairdresserList = document.getElementById("hairdresser-list");
let selectedHairdresser = null;
export function displayHairdressers() {
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
            selectedData = appointmentDateInput.value;
            displayAvailableAppointments(hairdresser, appointmentDateInput.value);
        });
    }
}
