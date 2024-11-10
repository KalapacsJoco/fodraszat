// import { getHairdressers } from "../controllers/HairdresserController.js";


// export async function displayHairdressers() {
//   if (hairdresserList) {
//     const hairdressers = await getHairdressers();
//     hairdressers.forEach((hairdresser) => {
//       const servicesList = hairdresser.services
//         .map((service) => `<li>${service}</li>`)
//         .join("");
//       const hairdresserElement = `
//                 <div class="hairdresser">
//                 <div>
//                     <h3>${hairdresser.name}</h3>
//                     <p>${hairdresser.email}</p>
//                     <p>${hairdresser.phone_number}</p>
//                     <p>Munkaidő: ${hairdresser.work_start_time} - ${hairdresser.work_end_time}</p>
//                     <ul>${servicesList}</ul> 
//                     <button data-hairdresser-id="${hairdresser.id}">Időpontfoglalás</button>
//                     </div>
//                     <img src="/assets/images/${hairdresser.id}.jpg" alt="Kép leírása">

//                 </div>
//             `;
//       hairdresserList.innerHTML += hairdresserElement;
//     });

//     // Appointment button event handler
//     // const appointmentButtons = document.querySelectorAll(".hairdresser button");
//     // appointmentButtons.forEach((button) => {
//     //   const buttonElement = button as HTMLElement;
//     //   buttonElement.addEventListener("click", () => {
//     //     const hairdresserId = buttonElement.dataset.hairdresserId;
//     //     if (hairdresserId) {
//     //       selectedHairdresser =
//     //         hairdressers.find((h) => h.id === parseInt(hairdresserId)) || null;
//     //       if (selectedHairdresser) {
//     //         showAppointmentForm(selectedHairdresser);
//     //       }
//     //     }
//     //   });
//     // });
//   }
// }