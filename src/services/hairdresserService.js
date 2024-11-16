"use strict";
// Fetch list of hairdressers
async function getHairdressers() {
    const response = await fetch(HAIRDRESSERS_URL);
    return await response.json();
}
