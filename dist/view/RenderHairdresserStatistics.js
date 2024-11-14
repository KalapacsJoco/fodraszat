var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { APPOINTMENTS_URL } from "../components/apiConfig.js";
export function renderHairdresserStatistics(hairdresserId) {
    return __awaiter(this, void 0, void 0, function* () {
        const statisticContainer = document.getElementById("statistic-days");
        if (!statisticContainer)
            return;
        statisticContainer.innerHTML = ""; // Törli az előző statisztikákat
        // Foglalások lekérése az API-ról
        const response = yield fetch(APPOINTMENTS_URL);
        const appointments = yield response.json();
        // Szűrés az adott fodrászhoz tartozó foglalásokra
        const filteredAppointments = appointments.filter((appointment) => appointment.hairdresser_id === hairdresserId.toString());
        // Napi foglalások összesítése
        const dailyAppointmentsCount = {};
        for (let day = 1; day <= 30; day++) {
            dailyAppointmentsCount[day] = 0;
        }
        filteredAppointments.forEach((appointment) => {
            const date = new Date(appointment.appointment_date);
            const day = date.getDate(); // Az appointment dátumának napja
            if (day >= 1 && day <= 30) {
                dailyAppointmentsCount[day]++;
            }
        });
        // Grafikon létrehozása
        for (let day = 1; day <= 30; day++) {
            const dayColumn = document.createElement("div");
            dayColumn.style.display = "inline-block";
            dayColumn.style.width = "20px";
            dayColumn.style.marginRight = "5px";
            dayColumn.style.verticalAlign = "bottom";
            dayColumn.style.textAlign = "center"; // Középre igazítás
            // Létrehozzuk a foglalások számának megfelelő vonalat
            const appointmentLine = document.createElement("div");
            appointmentLine.style.height = `${dailyAppointmentsCount[day] * 10}px`; // Magasság a foglalások száma alapján
            appointmentLine.style.width = "100%";
            appointmentLine.style.backgroundColor = "blue";
            // Létrehozzuk a nap számát jelző elemet
            const dayLabel = document.createElement("div");
            dayLabel.textContent = `${day}`;
            dayLabel.style.marginTop = "5px"; // Kis távolság a vonal és a nap között
            dayLabel.style.fontSize = "12px"; // Kisebb betűméret a nap számához
            // Hozzáadjuk a vonalat és a nap számát az oszlophoz
            dayColumn.appendChild(appointmentLine);
            dayColumn.appendChild(dayLabel);
            statisticContainer.appendChild(dayColumn);
        }
    });
}
