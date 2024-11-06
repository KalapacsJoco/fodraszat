

// Fetch list of hairdressers
async function getHairdressers(): Promise<Hairdresser[]> {
    const response = await fetch(HAIRDRESSERS_URL);
    return await response.json();
  }