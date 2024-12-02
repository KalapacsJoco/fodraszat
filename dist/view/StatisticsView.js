var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { APPOINTMENTS_URL, HAIRDRESSERS_URL } from "../components/apiConfig.js";
const statisticAppointments = document.getElementById("statistic-appointments");
export function getHairdresserStatistics() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const hairdressersResponse = yield fetch(HAIRDRESSERS_URL);
            const hairdressers = yield hairdressersResponse.json();
            const appointmentsResponse = yield fetch(APPOINTMENTS_URL);
            const appointments = yield appointmentsResponse.json();
            // Szűrés az aktuális hónapra és évre
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth(); // 0-indexelt (január = 0)
            const currentYear = currentDate.getFullYear();
            const filteredAppointments = appointments.filter((appointment) => {
                const appointmentDate = new Date(appointment.appointment_date);
                return (appointmentDate.getMonth() === currentMonth &&
                    appointmentDate.getFullYear() === currentYear);
            });
            const totalAppointments = filteredAppointments.length;
            const hairdresserStats = hairdressers.map((hairdresser) => {
                const hairdresserAppointments = filteredAppointments.filter((appointment) => appointment.hairdresser_id === hairdresser.id.toString()).length;
                const percentage = Math.round((hairdresserAppointments / totalAppointments) * 100);
                return {
                    name: hairdresser.name,
                    appointments: hairdresserAppointments,
                    percentage: percentage,
                };
            });
            hairdresserStats.sort((a, b) => b.appointments - a.appointments);
            displayHairdresserStatistics(hairdresserStats);
        }
        catch (error) {
            console.error("Hiba történt az adatok lekérése során:", error);
        }
    });
}
function displayHairdresserStatistics(stats) {
    if (statisticAppointments) {
        statisticAppointments.innerHTML = ""; // Törli az előző statisztikákat
        stats.forEach((stat) => {
            const hairdresserDiv = document.createElement("div");
            hairdresserDiv.textContent = `${stat.name}: ${stat.appointments}`;
            const lineDiv = document.createElement("div");
            lineDiv.style.width = `${stat.percentage * 2}px`;
            lineDiv.style.height = "10px";
            lineDiv.style.backgroundColor = "#0d47a1";
            hairdresserDiv.appendChild(lineDiv);
            statisticAppointments.appendChild(hairdresserDiv);
        });
    }
}
