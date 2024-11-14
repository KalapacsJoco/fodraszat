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
                option.textContent = hairdresser.name;
                hairdresserSelect.appendChild(option);
            });
        }
        catch (error) {
            console.error("Error loading hairdressers:", error);
        }
    });
}
// Fetch all appointments and filter by the selected hairdresser ID
