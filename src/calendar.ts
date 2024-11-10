// calendar.ts
const calendarContainer = document.getElementById("calendar-container") as HTMLElement;
const today = new Date();
const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
const startDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
const totalCells = 35; // 7 columns x 5 rows

for (let i = 0; i < totalCells; i++) {
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("calendar-day");

    // Calculate day number to display
    const dayNumber = i >= startDay && i < startDay + daysInMonth ? i - startDay + 1 : "";

    if (dayNumber) {
        dayDiv.textContent = dayNumber.toString();

        // Highlight the current day
        if (dayNumber === today.getDate()) {
            dayDiv.classList.add("active");
        }

        // Add click event to open a new window with the day
        dayDiv.addEventListener("click", () => {
            const newWindow = window.open("", "_blank", "width=300,height=200");
            if (newWindow) { // Check if the window opened successfully
                newWindow.document.write(`<h2>Selected Day: ${dayNumber}</h2>`);
            } else {
                console.error("Failed to open a new window.");
            }
        });
        
    }

    calendarContainer.appendChild(dayDiv);
}
