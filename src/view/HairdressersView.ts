// import { formatTime } from "../components/FormatTime.js";
// import { checkIfBooked, getAppointments } from "../controllers/AppointmentController.js";
// import { Hairdresser } from "../models/Hairdresser.js";

// const appointmentTimes = document.getElementById("appointment-times");
// let selectedDate: string | null = null;
// let selectedTimeSlot: string | null = null;



// export async function displayAvailableAppointments(
//     hairdresser: Hairdresser,
//     date: string
//   ) {
//     if (appointmentTimes) {
//       appointmentTimes.innerHTML = "";
//       selectedDate = date;
  
//       const startTime = parseInt(hairdresser.work_start_time.split(":")[0]) * 60;
//       const endTime = parseInt(hairdresser.work_end_time.split(":")[0]) * 60;
//       const appointments = await getAppointments();
  
//       for (let time = startTime; time < endTime; time += 30) {
//         const timeSlot = document.createElement("div");
//         timeSlot.classList.add("time-slot");
//         const formattedTime = formatTime(time);
//         timeSlot.textContent = formattedTime;
  
//         const isBooked = checkIfBooked(
//           appointments,
//           hairdresser.id,
//           date,
//           formattedTime
//         );
  
//         if (isBooked) {
//           timeSlot.classList.add("booked");
//         } else {
//           timeSlot.addEventListener("click", () => {
//             const previouslySelected = document.querySelector(
//               ".time-slot.selected"
//             );
//             if (previouslySelected)
//               previouslySelected.classList.remove("selected");
//             timeSlot.classList.add("selected");
//             selectedTimeSlot = formattedTime;
//           });
//         }
  
//         appointmentTimes.appendChild(timeSlot);
//       }
//     }
//   }
  