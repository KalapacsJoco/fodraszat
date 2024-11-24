"use strict";
// import { Hairdresser } from "../models/Hairdresser";
// import { getHairdressers } from "../controllers/HairdresserController.js";
// import {
//   setSelectedHairdresser,
//   setSelectedDate,
//   setSelectedService,
// } from "../utils/state.js";
// import {
//   hairdresserList,
//   appointmentForm,
//   appointmentServices,
//   appointmentDateInput,
// } from "../components/domElements.js";
// import { displayAvailableAppointments } from "../view/AppointmentView.js";
// export  async function displayHairdressers() {
//       if (hairdresserList) {
//         const hairdressers = await getHairdressers();
//         hairdressers.forEach((hairdresser) => {
//           const servicesList = hairdresser.services
//             .map((service) => `<li>${service}</li>`)
//             .join("");
//           const hairdresserElement = `
//                     <div class="hairdresser">
//                     <div>
//                         <h3>${hairdresser.name}</h3>
//                         <p>${hairdresser.email}</p>
//                         <p>${hairdresser.phone_number}</p>
//                         <p>Munkaidő: ${hairdresser.work_start_time} - ${hairdresser.work_end_time}</p>
//                         <ul>${servicesList}</ul> 
//                         <button data-hairdresser-id="${hairdresser.id}">Időpontfoglalás</button>
//                         </div>
//                         <img src="/assets/images/${hairdresser.id}.jpg" alt="Kép leírása">
//                     </div>
//                 `;
//           if (hairdresserList) {
//             hairdresserList.innerHTML += hairdresserElement;
//           }
//         });
//         const appointmentButtons = document.querySelectorAll(".hairdresser button");
//         appointmentButtons.forEach((button) => {
//           const buttonElement = button as HTMLElement;
//           buttonElement.addEventListener("click", () => {
//             const hairdresserId = buttonElement.dataset.hairdresserId;
//             if (hairdresserId) {
//               const selectedHairdresser =
//                 hairdressers.find((h) => h.id === parseInt(hairdresserId)) || null;
//               setSelectedHairdresser(selectedHairdresser);
//               if (selectedHairdresser) {
//                 showAppointmentForm(selectedHairdresser);
//               }
//             }
//           });
//         });
//       }
//     }
// export function showAppointmentForm(hairdresser: Hairdresser) {
//   if (appointmentForm) {
//     appointmentForm.style.display = "block";
//     setSelectedHairdresser(hairdresser);
//     if (appointmentServices) {
//       appointmentServices.innerHTML = "";
//       hairdresser.services.forEach((service) => {
//         const checkbox = document.createElement("input");
//         checkbox.type = "checkbox";
//         checkbox.name = "service";
//         checkbox.value = service;
//         const label = document.createElement("label");
//         label.textContent = service;
//         if (appointmentServices) {
//         appointmentServices.appendChild(checkbox);
//         appointmentServices.appendChild(label);
//         appointmentServices.appendChild(document.createElement("br"));
//         }
//       });
//     }
//   }
//   if (appointmentDateInput) {
//     appointmentDateInput.addEventListener("change", () => {
//       setSelectedDate(appointmentDateInput.value);
//       displayAvailableAppointments(hairdresser, appointmentDateInput.value);
//     });
//   }
// }
// export function handleServiceSelection(checkbox: HTMLInputElement) {
//   const checkboxes = document.querySelectorAll(
//     'input[name="service"]'
//   ) as NodeListOf<HTMLInputElement>;
//   checkboxes.forEach((cb) => {
//     if (cb !== checkbox) cb.checked = false;
//   });
//   setSelectedService(checkbox.checked ? checkbox.value : null);
// }
