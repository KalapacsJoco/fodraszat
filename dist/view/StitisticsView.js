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
const statisticContainer = document.getElementById("statistic-container");
export function getHairdresserStatistics() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const hairdressersResponse = yield fetch(HAIRDRESSERS_URL);
            const hairdressers = yield hairdressersResponse.json();
            const appointmentsResponse = yield fetch(APPOINTMENTS_URL);
            const appointments = yield appointmentsResponse.json();
            const totalAppointments = appointments.length; // Összes foglalás száma
            // Fodrászok foglalásainak kiszámítása
            const hairdresserStats = hairdressers.map(hairdresser => {
                const hairdresserAppointments = appointments.filter(appointment => appointment.hairdresser_id === hairdresser.id.toString()).length;
                const percentage = Math.round((hairdresserAppointments / totalAppointments) * 100);
                return {
                    name: hairdresser.name,
                    appointments: hairdresserAppointments,
                    percentage: percentage,
                };
            });
            // Statisztikák megjelenítése
            displayHairdresserStatistics(hairdresserStats);
        }
        catch (error) {
            console.error('Hiba történt az adatok lekérése során:', error);
        }
    });
}
function displayHairdresserStatistics(stats) {
    if (statisticContainer) {
        statisticContainer.innerHTML = ''; // Töröljük a korábbi tartalmat
        stats.forEach(stat => {
            const hairdresserDiv = document.createElement('div');
            hairdresserDiv.textContent = `${stat.name}: ${stat.appointments} foglalás`;
            const lineDiv = document.createElement('div');
            lineDiv.style.width = `${stat.percentage}%`;
            lineDiv.style.height = '10px';
            lineDiv.style.backgroundColor = 'blue'; // A vonal színe
            hairdresserDiv.appendChild(lineDiv);
            statisticContainer.appendChild(hairdresserDiv);
        });
    }
}
