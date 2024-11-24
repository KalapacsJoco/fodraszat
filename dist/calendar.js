import { closeModalButton, modal } from './components/domElements.js';
import { handleHairdresserSelection } from './controllers/HairdresserController.js';
import { loadHairdresserOptions } from './controllers/HairdresserController.js';
import { updateCalendar } from './controllers/CalendarController.js';
import { getHairdresserStatistics } from './view/StatisticsView.js';
closeModalButton.addEventListener('click', () => {
    modal.style.display = 'none';
});
// Inicializáció
handleHairdresserSelection();
loadHairdresserOptions();
getHairdresserStatistics();
updateCalendar([]);
