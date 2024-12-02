"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
