import { Hairdresser } from "../models/Hairdresser";

export const hairdresserList = document.getElementById("hairdresser-list");
export const appointmentForm = document.getElementById("appointment-form");
export const appointmentDateInput = document.getElementById(
  "appointment-date"
) as HTMLInputElement;
export const appointmentTimes = document.getElementById("appointment-times");
export const appointmentServices = document.getElementById("appointment-services");
export const appointmentNameInput = document.getElementById(
  "appointment-name"
) as HTMLInputElement;
export const appointmentPhoneInput = document.getElementById(
  "appointment-phone"
) as HTMLInputElement;
export const appointmentSubmitButton = document.getElementById(
  "appointment-submit"
) as HTMLButtonElement;
export const appointmentCloseButton = document.getElementById(
  "appointment-form-close-button"
) as HTMLButtonElement;
  
//   export let selectedTimeSlot: string | null = null;
//   export let selectedHairdresser: Hairdresser | null = null;
//   export let selectedDate: string | null = null;
//   export let selectedService: string | null = null;