// state.ts

import { Hairdresser } from "../models/Hairdresser";


// Állapot objektum
const state = {
  selectedTimeSlot: null as string | null,
  selectedHairdresser: null as Hairdresser | null,
  selectedDate: null as string | null,
  selectedService: null as string | null,
};

// Getter függvények
export const getSelectedTimeSlot = () => state.selectedTimeSlot;
export const getSelectedHairdresser = () => state.selectedHairdresser;
export const getSelectedDate = () => state.selectedDate;
export const getSelectedService = () => state.selectedService;

// Setter függvények
export const setSelectedTimeSlot = (timeSlot: string | null) => {
  state.selectedTimeSlot = timeSlot;
};

export const setSelectedHairdresser = (hairdresser: Hairdresser | null) => {
  state.selectedHairdresser = hairdresser;
};

export const setSelectedDate = (date: string | null) => {
  state.selectedDate = date;
};

export const setSelectedService = (service: string | null) => {
  state.selectedService = service;
};
