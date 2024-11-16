"use strict";
// Fetch all appointments
async function getAppointments() {
    try {
        const response = await fetch(APPOINTMENTS_URL);
        return await response.json();
    }
    catch (error) {
        console.error("Hiba az időpontok lekérése során:", error);
        return [];
    }
}
async function bookAppointment(appointment) {
    try {
        const response = await fetch(APPOINTMENTS_URL, {
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
}
