"use strict";
// import { Hairdresser } from "../models/Hairdresser";
// import { appointmentDateInput, appointmentForm, appointmentServices } from "../components/domElements";
// let selectedDate: string | null = null;
// let selectedService: string | null = null;
// export function showAppointmentForm(
//   hairdresser: Hairdresser,
//   displayAvailableAppointments: (hairdresser: Hairdresser, date: string) => void
// ) {
//   if (appointmentForm) {
//     appointmentForm.style.display = "block";
//     if (appointmentServices) {
//       appointmentServices.innerHTML = ""; 
//       hairdresser.services.forEach((service) => {
//         const checkbox = document.createElement("input");
//         checkbox.type = "checkbox";
//         checkbox.name = "service";
//         checkbox.value = service;
//         checkbox.addEventListener("change", () => handleServiceSelection(checkbox));
//         const label = document.createElement("label");
//         label.textContent = service;
//         if (appointmentServices) {
//           appointmentServices.appendChild(checkbox);
//           appointmentServices.appendChild(label);
//           appointmentServices.appendChild(document.createElement("br"));
//         }
//       });
//     }
//   }
//   if (appointmentDateInput) {
//     appointmentDateInput.addEventListener("change", () => {
//       selectedDate = appointmentDateInput.value;
//       // Meghívjuk a displayAvailableAppointments callback-et az aktuális fodrásszal és dátummal
//       displayAvailableAppointments(hairdresser, appointmentDateInput.value);
//     });
//   }
// }
// function handleServiceSelection(checkbox: HTMLInputElement) {
//   const checkboxes = document.querySelectorAll('input[name="service"]') as NodeListOf<HTMLInputElement>;
//   checkboxes.forEach((cb) => {
//     if (cb !== checkbox) cb.checked = false;
//   });
//   selectedService = checkbox.checked ? checkbox.value : null;
// }
// export { selectedDate, selectedService };
