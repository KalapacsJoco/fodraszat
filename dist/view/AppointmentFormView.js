import { displayAvailableAppointments } from "./AppointmentView.js";
import { appointmentForm, appointmentServices, appointmentDateInput, } from "../components/domElements.js";
import { setSelectedHairdresser, setSelectedDate, setSelectedService, } from "../utils/state.js";
/**
 * Megjeleníti az időpontfoglalási űrlapot a kiválasztott fodrász adataival.
 */
export function showAppointmentForm(hairdresser) {
    if (appointmentForm) {
        appointmentForm.style.display = "block";
        setSelectedHairdresser(hairdresser);
        if (appointmentServices) {
            // Tisztítjuk az űrlap tartalmát
            appointmentServices.innerHTML = "";
            // Fodrász szolgáltatásainak listázása
            hairdresser.services.forEach((service) => {
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.name = "service";
                checkbox.value = service;
                // Eseménykezelő a szolgáltatás kiválasztásához
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
        // Eseménykezelő a dátumváltozásra
        appointmentDateInput.addEventListener("change", () => {
            const selectedDate = appointmentDateInput.value;
            setSelectedDate(selectedDate);
            displayAvailableAppointments(hairdresser, selectedDate);
        });
    }
}
/**
 * Kezeli a szolgáltatás kiválasztását.
 */
function handleServiceSelection(checkbox) {
    const checkboxes = document.querySelectorAll('input[name="service"]');
    checkboxes.forEach((cb) => {
        if (cb !== checkbox)
            cb.checked = false;
    });
    setSelectedService(checkbox.checked ? checkbox.value : null);
}
