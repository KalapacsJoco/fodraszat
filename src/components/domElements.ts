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
export const calendarContainer = document.getElementById("calendar-container") as HTMLElement;
export const hairdresserSelect = document.getElementById("hairdresser-select") as HTMLSelectElement;
export const today = new Date();
 // Modal elements
export const modal = document.getElementById("appointment-modal") as HTMLElement;
export const modalTitle = document.getElementById("modal-day-title") as HTMLElement;
export const modalInfo = document.getElementById("modal-appointment-info") as HTMLElement;
export const closeModalButton = document.getElementById("close-modal") as HTMLElement;