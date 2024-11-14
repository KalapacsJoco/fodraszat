import { Hairdresser } from '../models/Hairdresser';
import {  HAIRDRESSERS_URL } from '../components/apiConfig.js';
import { hairdresserSelect } from '../components/domElements.js';
import { hairdresserList } from "../components/domElements.js";


export async function getHairdressers(): Promise<Hairdresser[]> {
  const response = await fetch(HAIRDRESSERS_URL);
  return await response.json();
}

// Populate the select menu with hairdressers
export async function loadHairdresserOptions() {
  const option =document.createElement("option");
  // option.value = ""
  option.textContent = "Válassz fodrászt"
  hairdresserSelect.appendChild(option);


  try {
      const hairdressers = await getHairdressers();
      hairdressers.forEach(hairdresser => {
          const option = document.createElement("option");
          option.value = hairdresser.id.toString();
          option.textContent = hairdresser.name;
          hairdresserSelect.appendChild(option);
      });
  } catch (error) {
      console.error("Error loading hairdressers:", error);
  }
}

// src/controllers/HairdresserController.ts

// src/controllers/HairdresserController.ts

export async function displayHairdressers(
  showAppointmentForm: (hairdresser: Hairdresser) => void
) {
  if (hairdresserList) {
    const hairdressers = await getHairdressers();
    hairdressers.forEach((hairdresser) => {
      const servicesList = hairdresser.services.map((service) => `<li>${service}</li>`).join("");
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
      if (hairdresserList) {
      hairdresserList.innerHTML += hairdresserElement;
      }
    });

    const appointmentButtons = document.querySelectorAll(".hairdresser button");
    appointmentButtons.forEach((button) => {
      const buttonElement = button as HTMLElement; // Típus kényszerítése HTMLElement-re
      buttonElement.addEventListener("click", () => {
        const hairdresserId = parseInt(buttonElement.dataset.hairdresserId || "");
        const selectedHairdresser = hairdressers.find((h) => h.id === hairdresserId);
        if (selectedHairdresser) showAppointmentForm(selectedHairdresser);
      });
    });
    
  }
}




// Fetch all appointments and filter by the selected hairdresser ID

