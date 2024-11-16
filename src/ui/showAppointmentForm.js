"use strict";
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
