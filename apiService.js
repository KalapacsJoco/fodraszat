export class ApiService {
    constructor() {
        this.apiBaseUrl = 'http://salonsapi.prooktatas.hu/api';
    }
    async getHairdressers() {
        const response = await fetch(`${this.apiBaseUrl}/hairdressers`);
        if (!response.ok)
            throw new Error('Nem sikerült betölteni a fodrászokat');
        return response.json();
    }
    async getAppointment(hairdresserId) {
        let url = `${this.apiBaseUrl}/appointments`;
        // Ha megadtuk a fodrász ID-jét, akkor hozzáadjuk a lekérdezési paraméterhez
        if (hairdresserId) {
            url += `?hairdresserId=${hairdresserId}`;
        }
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok)
            throw new Error('Nem sikerült lekérni a foglalásokat');
        return response.json();
    }
    async createAppointment(data) {
        const response = await fetch(`${this.apiBaseUrl}/appointments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok)
            throw new Error('Nem sikerült létrehozni a foglalást');
        return response.json();
    }
}
