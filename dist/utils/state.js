// state.ts
// Állapot objektum
const state = {
    selectedTimeSlot: null,
    selectedHairdresser: null,
    selectedDate: null,
    selectedService: null,
};
// Getter függvények
export const getSelectedTimeSlot = () => state.selectedTimeSlot;
export const getSelectedHairdresser = () => state.selectedHairdresser;
export const getSelectedDate = () => state.selectedDate;
export const getSelectedService = () => state.selectedService;
// Setter függvények
export const setSelectedTimeSlot = (timeSlot) => {
    state.selectedTimeSlot = timeSlot;
};
export const setSelectedHairdresser = (hairdresser) => {
    state.selectedHairdresser = hairdresser;
};
export const setSelectedDate = (date) => {
    state.selectedDate = date;
};
export const setSelectedService = (service) => {
    state.selectedService = service;
};
