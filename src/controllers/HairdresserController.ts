import { Hairdresser } from '../models/Hairdresser';
import {  HAIRDRESSERS_URL } from '../components/apiConfig.js';
import { hairdresserSelect } from '../components/domElements.js';

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

// Fetch all appointments and filter by the selected hairdresser ID

