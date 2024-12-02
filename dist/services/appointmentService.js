"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Fetch all appointments
function getAppointments() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(APPOINTMENTS_URL);
            return yield response.json();
        }
        catch (error) {
            console.error("Hiba az időpontok lekérése során:", error);
            return [];
        }
    });
}
function bookAppointment(appointment) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(APPOINTMENTS_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(appointment),
            });
            if (response.ok) {
                console.log("Időpontfoglalás sikeres!");
                alert("Időpontfoglalás sikeres!");
                location.reload();
                if (selectedHairdresser && selectedDate) {
                    displayAvailableAppointments(selectedHairdresser, selectedDate);
                }
            }
            else {
                console.error("Hiba történt az időpontfoglalás során!");
                alert("Hiba történt az időpontfoglalás során!");
            }
        }
        catch (error) {
            console.error("Hiba történt az időpontfoglalás során:", error);
            alert("Hiba történt az időpontfoglalás során!");
        }
    });
}
