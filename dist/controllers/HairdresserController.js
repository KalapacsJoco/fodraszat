var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HAIRDRESSERS_URL } from '../components/apiConfig.js';
import { hairdresserSelect } from '../components/domElements.js';
import { loadAppointmentsForHairdresser } from './CalendarController.js';
import { renderHairdresserStatistics } from '../view/RenderHairdresserStatistics.js';
export function getHairdressers() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(HAIRDRESSERS_URL);
        return yield response.json();
    });
}
// Populate the select menu with hairdressers
export function loadHairdresserOptions() {
    return __awaiter(this, void 0, void 0, function* () {
        const option = document.createElement("option");
        // option.value = ""
        option.textContent = "Válassz fodrászt";
        hairdresserSelect.appendChild(option);
        try {
            const hairdressers = yield getHairdressers();
            hairdressers.forEach(hairdresser => {
                const option = document.createElement("option");
                option.value = hairdresser.id.toString();
                option.style.backgroundColor = "transparent";
                option.textContent = hairdresser.name;
                hairdresserSelect.appendChild(option);
            });
        }
        catch (error) {
            console.error("Error loading hairdressers:", error);
        }
    });
}
export function handleHairdresserSelection() {
    if (hairdresserSelect) {
        hairdresserSelect.addEventListener('change', () => {
            const selectedHairdresserId = parseInt(hairdresserSelect.value, 10);
            if (!isNaN(selectedHairdresserId)) {
                loadAppointmentsForHairdresser(selectedHairdresserId);
                renderHairdresserStatistics(selectedHairdresserId);
            }
        });
    }
}
// src/controllers/HairdresserController.ts
// src/controllers/HairdresserController.ts
// export async function displayHairdressers(
//   showAppointmentForm: (hairdresser: Hairdresser) => void
// ) {
//   if (hairdresserList) {
//     const hairdressers = await getHairdressers();
//     hairdressers.forEach((hairdresser) => {
//       const servicesList = hairdresser.services.map((service) => `<li>${service}</li>`).join("");
//       const hairdresserElement = `
//         <div class="hairdresser">
//           <div>
//             <h3>${hairdresser.name}</h3>
//             <p>${hairdresser.email}</p>
//             <p>${hairdresser.phone_number}</p>
//             <p>Munkaidő: ${hairdresser.work_start_time} - ${hairdresser.work_end_time}</p>
//             <ul>${servicesList}</ul>
//             <button data-hairdresser-id="${hairdresser.id}">Időpontfoglalás</button>
//           </div>
//           <img src="/assets/images/${hairdresser.id}.jpg" alt="Kép leírása">
//         </div>
//       `;
//       if (hairdresserList) {
//       hairdresserList.innerHTML += hairdresserElement;
//       }
//     });
//     const appointmentButtons = document.querySelectorAll(".hairdresser button");
//     appointmentButtons.forEach((button) => {
//       const buttonElement = button as HTMLElement; // Típus kényszerítése HTMLElement-re
//       buttonElement.addEventListener("click", () => {
//         const hairdresserId = parseInt(buttonElement.dataset.hairdresserId || "");
//         const selectedHairdresser = hairdressers.find((h) => h.id === hairdresserId);
//         if (selectedHairdresser) showAppointmentForm(selectedHairdresser);
//       });
//     });
//   }
// }
// Fetch all appointments and filter by the selected hairdresser ID
